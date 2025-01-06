let express = require('express')
let router = express.Router()

let Card = require("../models/cardSchema")

router.get('/', function (req, res) {
    res.send("WIP: Default Cards Page")
})

/**
 * Retrieve a card by its ID
 * GET: localhost:3000/cards/:id
 */
router.get('/get', async function (req, res) {
    const {id} = req.body

    try {
        if (!id) return res.status(400).send("ID cannot be empty")

        const card = await Card.findById(id, null, null)
        if (!card) return res.status(404).send("No cards found with this id")

        return res.status(200).send(card)
    } catch (error) {
        return res.status(500).send({message: error.message})
    }
})

/**
 * Creating a new card.
 * If no category is specified the default "General" category will be applied.
 * POST: localhost:3000/cards/create
 */
router.post('/create', async function (req, res) {
    const {question, type, answers, correctAnswer, category} = req.body
    console.log("Received data:", {question, type, answers, correctAnswer, category})

    // Validate input
    let error = validateCardType(type, answers, correctAnswer)
    if (error) return res.status(400).send({message: error})

    if (!question) return res.status(400).send("Question is required")
    if (!type) return res.status(400).send("Type is required")
    if (!answers) return res.status(400).send("Answers is required")
    if (!correctAnswer) return res.status(400).send("Correct Answers is required")

    try {
        const card = new Card({question, type, answers, correctAnswer, category})
        await card.save()
        console.log("Card created successfully:", card)
        res.status(201).send({message: "Card created successfully"})
    } catch (error) {
        console.error("Error saving card:", error)
        res.status(500).send({message: "Error saving card: " + error.message})
    }
})

/**
 * Updating an already existing card
 * PUT: localhost:3000/cards/update/:id
 */
router.put('/update/:id', async function (req, res) {
    const {id} = req.params
    const {question, type, answers, correctAnswer, category} = req.body

    try {
        // Validate input
        let error = validateCardType(type, answers, correctAnswer)
        if (error) return res.status(400).send({message: error})

        // Find the card by ID and update it
        const updatedCard = await Card.findByIdAndUpdate(
            {_id: id},
            {question, type, answers, correctAnswer, category},
            null
        )

        // If the card was not found
        if (!updatedCard) {
            return res.status(404).send({message: `Card with ID ${id} not found.`})
        }

        return res.status(200).send({message: "Card updated successfully.", updatedCard})
    } catch (error) {
        return res.status(500).send({message: "Error updating card: " + error.message})
    }
})

/**
 * Validating card type and needed answer configuration
 * @param type type of the card e.g., "true_false"
 * @param answers array of answers
 * @param correctAnswer the correct answer
 * @returns {string} Only if an error occurred, otherwise nothing
 */
function validateCardType(type, answers, correctAnswer) {
    if (type === 'true_false') {
        if (!Array.isArray(answers) || answers.length !== 2 || answers[0] !== 'True' || answers[1] !== 'False') {
            return "Answers must be ['True', 'False'] for true/false questions."
        }

        if (correctAnswer !== 'True' && correctAnswer !== 'False') {
            return "CorrectAnswer must be 'True' or 'False' for true/false questions."
        }
    }
}

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

module.exports = router