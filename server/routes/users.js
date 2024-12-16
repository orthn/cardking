let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt')
let dbManager = require('../controllers/dbManager')
let User = require('../models/userSchema')

/*class User {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}*/

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

        // TODO: Input validation? Or done at front end?
        // Enis: am besten beides einfach
        if (!username || !email || !password) {
            return res.status(400).json({ error: "username, email und password sind erforderlich" });
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send("Username already exists");
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



router.get('/login', async function (req, res) {
    /*
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
     */
    const { username, password, email, goal } = req.body;

    if (username === undefined || username === null || username === "") res.status(400).send("Username is required");
    if (password === undefined || password === null || password === "") res.status(400).send("Password is required");
    if (email === undefined || email === null || email === "") res.status(400).send("Email is required");

    //let user = new User(username, password, email);
    // retrieve userdata from database for checking validity and password
    let dbUser = await User.findOne( { username });
    if (!dbUser) {
        return res.status(404).send("User not found");
    }

    let check = await bcrypt.compare(password, dbUser.password);

    if (check) res.status(200).send("User is authenticated");
    else res.status(401).send("Invalid credentials");
})

module.exports = router;
