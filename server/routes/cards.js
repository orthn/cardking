let express = require('express');
const mongoose = require("mongoose");
let router = express.Router();

let Card = require("../models/card");
const User = require("../models/userSchema");

router.get('/', function (req, res) {
    res.send("WIP: Default Cards Page");
})

// POST: Creating a card
router.post('/create', async function (req, res) {
    const {question, type, answers, correctAnswer} = req.body;

    if (!question) return res.status(400).send("Question is required");
    if (!type) return res.status(400).send("Type is required");
    if (!answers) return res.status(400).send("Answers is required");
    if (!correctAnswer) return res.status(400).send("Correct Answers is required");

    let card

    switch (type) {
        case 'true_false':
            card = new Card({
                question: question,
                type: 'true_false',
                answers: answers,               // ['true', 'false']
                correctAnswer: correctAnswer    // 'true'
            })
            break
        case 'single_choice':
            card = new Card({
                question: question,
                type: 'single_choice',
                answers: answers,               // ['A', 'B', 'C', 'D']
                correctAnswer: correctAnswer    // 'A'
            })
            break
        case 'multiple_choice':
            card = new Card({
                question: question,
                type: 'multiple_choice',
                answers: answers,               // ['A', 'B', 'C', 'D']
                correctAnswer: correctAnswer    // ['A', 'B', 'D']
            })
            break
    }

    await card.save()
        .then(r => {
            console.log('Card created & saved successfully!')
            return res.status(201).send({message: "Card created successfully"})
        })
        .catch(err => {
            console.log(`Error saving card: ${err.message}`)
            return res.status(500).send({message: `Error saving card: ${err.message}`})
        })
})

// POST: Endpoint for checking if a correct answer was selected
router.post('/check', async function (req, res) {
    const {question, answer} = req.body;

    if (!question) return res.status(400).send("Question is required");

    const card = await Card.findOne({question})
    if (!card) return res.status(404).send("Card not found");

    if (answer === card.correctAnswer) return res.status(200).send(`Answer to question ${question} is correct`);
    else return res.status(200).send(`Correct answer to question ${question} is ${card.correctAnswer}`);
})

module.exports = router;