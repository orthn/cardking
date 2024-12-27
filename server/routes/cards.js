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

    if (!question) return res.status(400).send("Question is required")
    if (!type) return res.status(400).send("Type is required")
    if (!answers) return res.status(400).send("Answers is required")
    if (!correctAnswer) return res.status(400).send("Correct Answers is required")

    let card

    switch (type) {
        case 'true_false':
            card = new Card({
                question: question,
                type: 'true_false',
                answers: answers,               // ['true', 'false']
                correctAnswer: correctAnswer,   // 'true'
                category: category
            })
            break
        case 'single_choice':
            card = new Card({
                question: question,
                type: 'single_choice',
                answers: answers,               // ['A', 'B', 'C', 'D']
                correctAnswer: correctAnswer,   // 'A'
                category: category
            })
            break
        case 'multiple_choice':
            card = new Card({
                question: question,
                type: 'multiple_choice',
                answers: answers,               // ['A', 'B', 'C', 'D']
                correctAnswer: correctAnswer,   // ['A', 'B', 'D']
                category: category
            })
            break
    }

    await card.save()
        .then(() => {
            console.log('Card created & saved successfully!')
            return res.status(201).send({message: "Card created successfully"})
        })
        .catch(err => {
            console.log(`Error saving card: ${err.message}`)
            return res.status(500).send({message: `Error saving card: ${err.message}`})
        })
})

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

export async function checkAnswer(cardId, answer) {
    if (!cardId) return { status: 400, message: "ID of the card is required" };
    if (!answer) return { status: 400, message: "Answer is required" };

    const card = await Card.findOne({_id: cardId}, null, null)
    if (!card) return { status: 404, message: "Card not found" };

    if (answer === card.correctAnswer) return { status: 200, message: `Answer to question "${card.question}" is correct` };
    else return { status: 200, message: `Wrong: Correct answer to question "${card.question}" is "${card.correctAnswer}"` };
};
module.exports = router