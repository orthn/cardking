let express = require('express')
let router = express.Router()

let Card = require("../models/cardSchema")

router.get('/', function (req, res) {
    res.send("WIP: Default Cards Page")
})

/**
 * Creating a new card.
 * If no category is specified the default "General" category will be applied.
 * POST: localhost:3000/cards/create
 */
router.post('/create', async function (req, res) {
    const {question, type, answers, correctAnswer, category} = req.body
    console.log("Received data:", { question, type, answers, correctAnswer, category });

    if (type === 'true_false') {
        if (!Array.isArray(answers) || answers.length !== 2 || answers[0] !== 'True' || answers[1] !== 'False') {
            console.error("Validation failed for answers:", answers);
            return res.status(400).send("Answers must be ['True', 'False'] for true/false questions.");
        }

        if (correctAnswer !== 'True' && correctAnswer !== 'False') {
            console.error("Validation failed for correctAnswer:", correctAnswer);
            return res.status(400).send("CorrectAnswer must be 'True' or 'False' for true/false questions.");
        }
    }

    if (!question) return res.status(400).send("Question is required")
    if (!type) return res.status(400).send("Type is required")
    if (!answers) return res.status(400).send("Answers is required")
    if (!correctAnswer) return res.status(400).send("Correct Answers is required")

    try {
        const card = new Card({ question, type, answers, correctAnswer, category });
        await card.save();
        console.log("Card created successfully:", card);
        res.status(201).send({ message: "Card created successfully" });
    } catch (error) {
        console.error("Error saving card:", error);
        res.status(500).send({ message: "Error saving card: " + error.message });
    }
});

/**
 * Check if an answer to a card is correct. Card is identified by its ID.
 * POST: localhost:3000/cards/check
 * TODO: really needed? (FG)
 */
/*router.post('/check', async function (req, res) {
    const {id, answer} = req.body

    if (!id) return res.status(400).send("ID of the card is required")
    if (!answer) return res.status(400).send("Answer is required")

    const card = await Card.findOne({_id: id}, null, null)
    if (!card) return res.status(404).send("Card not found")

    if (answer === card.correctAnswer) return res.status(200).send(`Answer to question "${card.question}" is correct`)
    else return res.status(200).send(`Wrong: Correct answer to question "${card.question}" is "${card.correctAnswer}"`)
})*/

/**
 * Retrieve Cards for a given category.
 * If no category is specified or found, all cards will be returned.
 * GET: localhost:3000/cards/category
 */
router.get('/category', async function (req, res) {
    const {category} = req.body

    let cards

    if (!category) cards = await Card.find({}, null, null)
    else cards = await Card.find({category: category}, null, null)
    return res.status(200).send(cards)
})

async function checkAnswer(cardId, answer) {
    if (!cardId) return { status: 400, message: "ID of the card is required" };
    if (!answer) return { status: 400, message: "Answer is required" };

    const card = await Card.findOne({_id: cardId}, null, null)
    if (!card) return { status: 404, message: "Card not found" };

    if (answer === card.correctAnswer) return { status: 200, message: `Answer to question "${card.question}" is correct` };
    else return { status: 200, message: `Wrong: Correct answer to question "${card.question}" is "${card.correctAnswer}"` };
}

module.exports = router, checkAnswer