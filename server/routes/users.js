let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt')
let dbManager = require('../Controllers/dbManager')

class User {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send("WIP: Default Users Page");
});

//POST: Creating new User object
router.get('/register', async function (req, res) {
    let username = "Dummy"
    let password = await bcrypt.hash("Secure1234", await bcrypt.genSalt(12));
    let email = "user.test@domain.com";

    /*
    let username = req.body.username;
    let password = await bcrypt.hash(req.body.password, await bcrypt.genSaltSync(12));
    let email = req.body.email;
     */

    let user = new User(username, password, email);
    res.send(user);
})

router.get('/login', async function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    if (username === undefined || username === null || username === "") res.status(400).send("Username is required");
    if (password === undefined || password === null || password === "") res.status(400).send("Password is required");
    if (email === undefined || email === null || email === "") res.status(400).send("Email is required");

    let user = new User(username, password, email);
    // retrieve userdata from database for checking validity and password
    let dbUser = dbManager.getUserDetails(user.username);

    let check = await bcrypt.compare(password, dbUser.password);

    if (check) res.status(200).send("User is authenticated");
    else res.status(401).send("User is not authenticated");
})



module.exports = router;
