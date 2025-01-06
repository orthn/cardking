let express = require('express')
let router = express.Router()
let bcrypt = require('bcrypt')
let User = require('../models/userSchema')
let jwt = require('jsonwebtoken')
const {sendResetMail} = require("../controllers/mailHandler")
let secretKey = process.env.JWT_SECRET

/**
 * Retrieve all neccessary data to load the users dashboard
 * GET: localhost:3000/users/
 */
router.get('/', function (req, res, next) {
    res.send("WIP: Default Users Page")
})

/**
 * Retrieve Session ID for current user
 * GET: localhost:3000/users/me
 */
router.get('/me', function (req, res) {
    if (!req.session || !req.session.userId) {
        return res.status(401).send({message: 'Nicht eingeloggt'})
    }
    res.status(200).send({userId: req.session.userId})
})

/**
 * Retrieve users data
 * GET: localhost:3000/users/data
 */
router.get('/data', async function (req, res) {
    try {
        if (!req.session || !req.session.userId) return res.status(401).send({message: 'Not logged in'})
        const {userId, username} = req.query

        if (!userId && !username) {
            return res.status(400).send({message: 'userId or username is required'})
        }

        const dbUser = await User.findOne({
            $or: [{_id: userId}, {username: username}]
        })

        if (!dbUser) return res.status(404).send(
            {message: `Cannot find user with ID ${userId || 'N/A'} or username ${username || 'N/A'}`}
        )


        return res.status(200).send({user: dbUser})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'An error occurred while retrieving user data.'})
    }
})

/**
 * Update a already existing user object
 * PUT: localhost:3000/users/data
 */
router.put('/data', async function (req, res) {
    try {
        const {username, email, goal} = req.body

        const result = await User.updateOne(
            {username: username}, {$set: {email, goal}}
        )

        if (result.matchedCount === 0) {
            return res.status(404).send({message: `Cannot find user with username ${username}`})
        }

        return res.status(200).send({message: 'User updated successfully.'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'An error occurred while updating user data.'})
    }
})

/**
 * Creating a new user object
 * POST: localhost:3000/users/register
 */
router.post('/register', async function (req, res) {
    try {
        let {username, password, email, goal} = req.body
        username = username.trimEnd().toLowerCase()
        email = email.trimEnd().toLowerCase()

        if (!username || !email || !password) {
            return res.status(400).json({error: "Username, email and password are required"})
        }

        // Check if the user already exists
        let existingUser = await User.findOne({username: username}, null, null)
        if (existingUser) {
            console.log("Username already exists")
            return res.status(400).send("Username already exists")
        }

        // Check if the email already exists
        let existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            console.log("Email already in use");
            return res.status(400).send("Email already in use");
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new User instance using the User model
        const newUser = new User({
            username: username, email: email, password: hashedPassword, goal: goal || ''
        })

        await newUser.save()

        return res.status(201).send({message: "User registered successfully.", newUser})
    } catch (error) {
        console.error("Error during registration:", error)
        return res.status(500).send("Internal Server Error")
    }
})

/**
 * Login a already existing user
 * POST: localhost:3000/users/login
 */
router.post('/login', async function (req, res) {
    let {username, password} = req.body
    username = username.trimEnd().toLowerCase()

    if (!username) return res.status(400).send("Username is required")
    if (!password) return res.status(400).send("Password is required")

    // retrieve userdata from database for checking validity and password
    let dbUser = await User.findOne({username: username}, null, null)
    if (!dbUser) {
        return res.status(404).send("User not found")
    }

    let check = await bcrypt.compare(password, dbUser.password)
    if (check) {
        req.session.userId = dbUser._id
        return res.status(200).send("User is authenticated")
    } else return res.status(401).send("Invalid credentials")
})

/**
 * Logout a user by destroying the users session
 * POST: localhost:3000/users/logout
 */
router.post('/logout', async function (req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({message: 'Could not log out'})
        }
        res.clearCookie('connect.sid') // Clear session cookie
        res.json({message: 'Logged out'})
    })
})

/**
 * Request email for password reset procedure
 * POST: localhost:3000/users/reset-password
 */
router.post('/reset-password', async function (req, res) {
    let {email} = req.body

    if (!email) {
        return res.status(400).send("Email is required")
    }

    try {
        let dbUser = await User.findOne({email: email}, null, null)
        if (!dbUser) {
            return res.status(404).send("User not found")
        }

        let resetToken = jwt.sign({email: email}, secretKey, {expiresIn: '1h'})

        sendResetMail(email, resetToken)

        res.status(200).send("Password reset email sent")
    } catch (error) {
        console.error(error)
        res.status(500).send("Error during password reset")
    }

})

/**
 * Reset password using the token sent to the user
 * POST: localhost:3000/users/reset-password/:token
 */
router.post('/reset-password/:token', async function (req, res) {
    let {token} = req.params
    let {newPassword} = req.body

    if (!newPassword) {
        return res.status(400).send("New password is required")
    }

    try {
        let decode = jwt.verify(token, secretKey)
        let email = decode.email
        const dbUser = await User.findOne({email: email}, null, null)

        if (!dbUser) {
            return res.status(404).send("User not found")
        }

        dbUser.password = await bcrypt.hash(newPassword, 10)

        await dbUser.save()

        res.status(200).send('Password updated successfully')
    } catch (error) {
        console.error(error)
        res.status(400).send('Invalid or expired reset token')
    }

})

module.exports = router