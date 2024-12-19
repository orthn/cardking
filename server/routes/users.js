let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt')
let dbManager = require('../controllers/dbManager')
let User = require('../models/userSchema')
let jwt = require('jsonwebtoken');
const {sendResetMail} = require("../controllers/mailHandler");

/*class User {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}*/

let secretKey = process.env.JWT_SECRET;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send("WIP: Default Users Page");
});

//POST: Creating new User object
router.post('/register', async function (req, res) {
    try {
        /*
        let username = "Dummy"
        let password = await bcrypt.hash("Secure1234", await bcrypt.genSalt(12));
        let email = "user.test@domain.com";*/
        const { username, password, email, goal } = req.body;
        console.log(req.body)

        /*
        let username = req.body.username;
        let password = await bcrypt.hash(req.body.password, await bcrypt.genSaltSync(12));
        let email = req.body.email;
         */

        if (!username || !email || !password) {
            return res.status(400).json({ error: "username, email and password are required" });
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log("Username already exists");
            return res.status(400).send("Username already exists");
        }
         existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).send("User for this email address already exists");
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new User instance using the User model
        const newUser = new User({
            username:username,
            email: email,
            password: hashedPassword,
            goal: goal || ''
        });

        //let user = new User(username, password, email);
        await newUser.save();

        res.status(201).send({ message: "User registered successfully.", newUser });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/login', async function (req, res) {
    /*
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
     */
    const {username, password } = req.body;
    if (username === undefined || username === null || username === "") return res.status(400).send("Username is required");
    if (password === undefined || password === null || password === "") return res.status(400).send("Password is required");

    //let user = new User(username, password, email);
    // retrieve userdata from database for checking validity and password
    let dbUser = await User.findOne( { username });
    if (!dbUser) {
        return res.status(404).send("User not found");
    }

    let check = await bcrypt.compare(password, dbUser.password);

    if (check) return res.status(200).send("User is authenticated");
    else return res.status(401).send("Invalid credentials");
})

router.post('/reset-password', async function (req, res){
    let { email } = req.body;

    if (!email) {
        return res.status(400).send("Email is required");
    }

    try {
        let dbUser = await User.findOne({ email });
        if (!dbUser) {
            return res.status(404).send("User not found");
        }

        let resetToken = jwt.sign({ email: email }, secretKey, { expiresIn: '1h' });

        sendResetMail(email, resetToken);

        res.status(200).send("Password reset email sent");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during password reset")
    }

})

router.post('/reset-password/:token', async function (req, res) {
    let { token } = req.params;
    let { newPassword } = req.body;

    if (!newPassword) {
        res.status(400).send("New password is required");
    }

    try {
        let decode = jwt.verify(token, secretKey);
        let email = decode.email;
        const dbUser = await User.findOne({ email });
        if (!dbUser) {
            return res.status(404).send("User not found");
        }

        dbUser.password = await bcrypt.hash(newPassword, 10);

        await dbUser.save();

        res.status(200).send('Password updated successfully');
    } catch (error) {
        console.error(error);
        res.status(400).send('Invalid or expired reset token');
    }

})

module.exports = router;
