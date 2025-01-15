let express = require('express')
let router = express.Router()
let bcrypt = require('bcrypt')
let User = require('../models/userSchema')
let jwt = require('jsonwebtoken')
const {sendResetMail, sendUnsuccessfulLoginMail} = require("../controllers/mailHandler")
const test = require("node:test");
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
        return res.status(401).send({message: 'Not logged in'})
    }
    res.status(200).send({userId: req.session.userId})
})

/**
 * Retrieve users data
 * GET: localhost:3000/users/data
 */
router.get('/data', async function (req, res) {
    const userID = req.session.userId;
    if (!userID) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    try {
        const dbUser = await User.findById(userID).select('username email goal');
        if (!dbUser) {
            return res.status(404).send({message: 'User not found'});
        }

        return res.status(200).send({user: dbUser});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'An error occurred while retrieving user data.'});
    }
});


/**
 * Update an already existing user object
 * PUT: localhost:3000/users/data
 */
router.put('/data', async function (req, res) {
    try {
        const userId = req.session.userId;
        const {email, currentPasswordEmail, currentPassword, newPassword, goal} = req.body
        if (!userId) {
            return res.status(404).json({ message: "UserID not found." });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (newPassword && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect." });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }
        if (email && currentPasswordEmail) {
            const isMatch = await bcrypt.compare(currentPasswordEmail, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect." });
            } else{
                user.email = email;
            }
        }
        if (goal) {
            user.goal = goal;
        }
        await user.save();
        return res.status(200).json({ message: "User updated successfully." });
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
            return res.status(400).send({message: 'Username already exists'})
        }

        // Check if the email already exists
        let existingEmail = await User.findOne({email: email});
        if (existingEmail) {
            return res.status(400).send({message: 'Email already in use'})
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new User instance using the User model
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            goal: goal || 'no_goal',
            wrongCredentialsCount: 0,
            isActivated: true,
        })

        await newUser.save()

        return res.status(201).send({message: "User registered successfully.", newUser: newUser})
    } catch (error) {
        return res.status(500).send({message: 'Internal Server Error', error: error.message})
    }
})

/**
 * Login a already existing user
 * POST: localhost:3000/users/login
 */
router.post('/login', async function (req, res) {
    let {username, password} = req.body
    username = username.trimEnd().toLowerCase()

    if (!username) return res.status(400).send({message: 'Username is required'})
    if (!password) return res.status(400).send({message: 'Password is required'})

    try {
        // retrieve userdata from database for checking validity and password
        let dbUser = await User.findOne({username: username}, null, null)
        if (!dbUser) {
            return res.status(404).send({message: 'User not found'})
        }

        let check = await bcrypt.compare(password, dbUser.password)
        if (check) {
            dbUser.wrongCredentialsCount = 0;
            await dbUser.save();

            req.session.userId = dbUser._id;
            return res.status(200).send({message: 'User is authenticated'});
        } else {
            dbUser.wrongCredentialsCount++;
            await dbUser.save();
            if (dbUser.wrongCredentialsCount === 3) sendUnsuccessfulLoginMail(dbUser)
            return res.status(401).send({message: 'Invalid credentials'});
        }
    } catch (error) {
        return res.status(500).send({message: 'An unexpected error occurred', error: error.message})

    }
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

        sendResetMail(dbUser, resetToken)

        res.status(200).send("Password reset email sent")
    } catch (error) {
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
        return res.status(400).send({message: "New password is required."})
    }

    try {
        let decode = jwt.verify(token, secretKey)
        let email = decode.email
        const dbUser = await User.findOne({email: email}, null, null)

        if (!dbUser) {
            return res.status(404).send({message: "User not found."})
        }

        dbUser.password = await bcrypt.hash(newPassword, 10)

        await dbUser.save()
        return res.status(200).send({message: "Password updated successfully."})
    } catch (error) {
        console.error(error)
        return res.status(400).send({message: "Invalid or expired reset token.", error: error.message})
    }
})

module.exports = router