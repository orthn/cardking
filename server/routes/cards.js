let express = require('express')
let multer = require('multer')
let fs = require('fs')
let path = require('path')
let router = express.Router()

let Card = require("../models/cardSchema")
let Category = require("../models/categorySchema")

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

    // get userID from session
    const userId = req.session.userId

    if (!userId) {
        return res.status(401).send("User is not authenticated. Please log in.")
    }

    if (!question) return res.status(400).send("Question is required")
    if (!type) return res.status(400).send("Type is required")
    if (!answers) return res.status(400).send("Answers are required")
    if (!correctAnswer) return res.status(400).send("CorrectAnswer is required")

    try {
        // 1. Find or create category
        let categoryDoc = await Category.findOneAndUpdate(
            {category, userId},
            {$inc: {cardCount: 1}},  // Increment cardCount by 1
            null)


        if (!categoryDoc) {
            // If the category does not exist, create it
            categoryDoc = new Category({
                category,
                cardCount: 1,
                userId
            })
            await categoryDoc.save()
        }

        categoryId = categoryDoc._id

        // 3. create the card and hand over the category ID
        const card = new Card({question, type, answers, correctAnswer, categoryId})
        await card.save()


        console.log("Card created and added to category successfully:", card)
        res.status(201).send({message: "Card created successfully", card})
    } catch (error) {
        console.error("Error saving card or category:", error)
        res.status(500).send({message: "Error: " + error.message})
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
    try {
        const userId = req.session.userId
        const category = req.query.category

        let cards
        let categoryEntries

        if (!category) {
            categoryEntries = await Category.find({userId})

            if (!categoryEntries || categoryEntries.length === 0) {
                return res.status(404).json({message: "No categories found"})
            }

            const categoryIds = categoryEntries.map(category => category._id)
            cards = await Card.find({categoryId: {$in: categoryIds}})
        } else {
            //categoryEntries = await Category.findOne({ category, userId })

            //if (!categoryEntries) {
            //    return res.status(404).json({ message: "Category not found" })
            //}

            cards = await Card.find({categoryId: category})
            console.log(cards)
        }

        return res.status(200).send(cards)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Internal server error', error: err.message})
    }
})


/**
 * Delete a card by its ID
 * DELETE: localhost:3000/cards/delete/:id
 */
router.delete('/delete/:id', async function (req, res) {

    const {id} = req.params

    console.log('Received ID to delete:', id)

    try {
        const deletedCard = await Card.findByIdAndDelete(id)

        if (!deletedCard) {
            return res.status(404).send({message: `Card with ID ${id} not found.`})
        }

        await Category.findByIdAndUpdate(
            deletedCard.categoryId,
            {$inc: {cardCount: -1}}
        )

        console.log('Card deleted successfully:', deletedCard)

        return res.status(200).send({message: "Card deleted successfully.", deletedCard})
    } catch (error) {
        console.error('Error deleting card:', error)
        return res.status(500).send({message: "Error deleting card: " + error.message})
    }
})

router.get('/export', async function (req, res) {
    try {
        const userId = req.session.userId
        const {categoryId} = req.body

        let cards
        let category

        category = await Category.find({userId: userId, _id: categoryId}, null, null)
        if (!category) {
            return res.status(404).send({message: "No categories found"})
        }

        cards = await Card.find({categoryId: {$in: categoryId}}, null, null)
        if (!cards || cards.length === 0) {
            return res.status(404).send({message: `No cards found.`})
        }

        const formatted = {
            userId: userId,
            category: category.category,
            categoryId: categoryId,
            cardCount: category.cardCount,
            cards: cards.map(card => ({
                id: card._id.toString(),
                type: card.type,
                question: card.question,
                answers: card.answers,
                correctAnswer: card.correctAnswer,
            }))
        }

        res.setHeader('Content-Disposition', 'attachment filename="cards.json"')
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send(JSON.stringify(formatted, null, 2))
    } catch (error) {
        console.error("Error exporting cards", error)
        return res.status(500).send({message: 'Error exporting cards', error: error.message})
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflict
    }
});

const upload = multer({storage: storage})

router.post('/import', upload.single('file'), async function (req, res) {
    try {
        const {userId} = req.session.userId

        if (!req.file) {
            return res.status(404).send({message: "No file uploaded."})
        }

        const filePath = path.join(__dirname, 'uploads', req.file.filename)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const data = JSON.parse(fileContent)

        if (!data.category || !data.categoryId || !Array.isArray(data.cards)) {
            return res.status(400).send('Invalid file format');
        }

        const existingCategory = await Category.findOne({_id: data.categoryId, userId: data.userId}, null, null);

        // Create category if not existent
        if (!existingCategory) {
            const categoryDoc = new Category({
                category: data.category,
                cardCount: 1,
                userId: userId,
            })
            await categoryDoc.save()
        }

        const newCards = data.cards.map(cardData => {
            return new Card({
                categoryId: data.categoryId,
                type: cardData.type,
                question: cardData.question,
                answers: cardData.answers,
                correctAnswer: cardData.correctAnswer
            });
        });

        const savedCards = await Card.insertMany(newCards);
        return res.status(200).send({message: "Cards imported successfully", savedCards});
    } catch (error) {
        console.log("Error importing cards", error)
        return res.status(500).send({message: 'Error importing cards', error: error.message})
    }
})


module.exports = router