let express = require('express')
let router = express.Router()

let Card = require("../models/cardSchema")
let Category = require("../models/categorySchema");

router.get('/', function (req, res) {
    res.send("WIP: Default Cards Page")
})

/**
 * Creating a new card.
 * If no category is specified the default "General" category will be applied.
 * POST: localhost:3000/cards/create
 */
router.post('/create', async function (req, res) {
    const { question, type, answers, correctAnswer, category } = req.body;

    // Holen der userId aus der Session
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send("User is not authenticated. Please log in.");
    }

    if (!question) return res.status(400).send("Question is required");
    if (!type) return res.status(400).send("Type is required");
    if (!answers) return res.status(400).send("Answers are required");
    if (!correctAnswer) return res.status(400).send("CorrectAnswer is required");

    try {
        // 1. Erstelle die Karte
        const card = new Card({ question, type, answers, correctAnswer, category });
        await card.save();

        // 2. Finde oder erstelle die Kategorie
        let categoryDoc = await Category.findOne({ category, userId });

        if (!categoryDoc) {
            // Falls die Kategorie nicht existiert, erstelle sie
            categoryDoc = new Category({
                category,
                userId,
                cardCount: 0,
                cards: [],
            });
        }

        // 3. Füge die Karten-ID zur Kategorie hinzu
        categoryDoc.cards.push(card._id);
        categoryDoc.cardCount = categoryDoc.cards.length;
        await categoryDoc.save();

        console.log("Card created and added to category successfully:", card);
        res.status(201).send({ message: "Card created successfully", card });
    } catch (error) {
        console.error("Error saving card or category:", error);
        res.status(500).send({ message: "Error: " + error.message });
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

module.exports = router