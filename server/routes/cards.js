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
 * Checks if a category already exists and returns it if true
 * Otherwise creates new and returns category
 * @param category Name of the category
 * @param userId ID of the user
 */
async function createCategoryIfNotExists(category, userId) {
    try {
        // Check if the category already exists for the user
        let categoryDoc = await Category.findOneAndUpdate(
            {category, userId},
            {$inc: {cardCount: 1}},
            null
        )

        // If category doesn't exist, create a new one
        if (!categoryDoc) {
            categoryDoc = new Category({
                category,
                cardCount: 1,
                userId
            })

            // Save the new category to the database
            await categoryDoc.save()
        }

        return categoryDoc
    } catch (error) {
        console.error("Error creating or finding category:", error)
        throw new Error("Error creating or finding category")
    }
}

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
        const categoryDoc = await createCategoryIfNotExists(category, userId)
        const categoryId = categoryDoc._id
        // Create card and hand over the category ID
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
 * If no category is specified or found, all cards will be returned for the users categories.
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
            cards = await Card.find({categoryId: category})
        }

        return res.status(200).send(cards)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Internal server error', error: err.message})
    }
})

/**
 * Create a new category for a user.
 * - Checks if the category already exists for the user, if not creates a new category.
 * POST: localhost:3000/cards/category
 */
router.post('/category', async function (req, res) {
    const {category} = req.body
    const userId = req.session.userId

    if (!userId) {
        return res.status(401).send("User is not authenticated. Please log in.")
    }

    try {
        const categoryDoc = await createCategoryIfNotExists(category, userId)

        return res.status(200).send({message: "Category created or found successfully.", categoryId: categoryDoc.categoryId})
    } catch (error) {
        return res.status(500).send({message: "Error creating category", error: error.message})
    }
})

/**
 * Delete a card by its ID.
 * - The card is removed from the database using the card ID.
 * - The associated category's card count is decremented.
 * DELETE: localhost:3000/cards/delete/:id
 */
router.delete('/delete/:id', async function (req, res) {
    try {
        const {id} = req.params

        if (!id) return res.status(400).send({message: "Card ID is required."})

        const deletedCard = await Card.findByIdAndDelete(id)
        if (!deletedCard) {
            return res.status(404).send({message: `Card with ID ${id} not found.`})
        }

        await Category.findByIdAndUpdate(
            deletedCard.categoryId,
            {$inc: {cardCount: -1}} // Decrement card count by 1
        )

        return res.status(200).send({message: "Card deleted successfully.", deletedCard})
    } catch (error) {
        return res.status(500).send({message: "Error deleting card: " + error.message})
    }
})

/**
 * Export cards of a specific category for a user.
 * - The user provides the category ID as a query parameter.
 * - Retrieves all cards for the given category from the database.
 * - Formats the data into a JSON file for download.
 * GET: localhost:3000/cards/export
 */
router.get('/export', async function (req, res) {
    try {
        const userId = req.session.userId
        const categoryId = req.query.categoryId

        if (!categoryId) return res.status(400).send({message: "Category ID is required."})

        // Check if category exists and belongs to the user
        const category = await Category.find({userId: userId, _id: categoryId}, null, null)
        if (!category) {
            return res.status(404).send({message: "Category not found or does not belong to the user."})
        }

        // Retrieve all cards associated with the category
        const cards = await Card.find({categoryId: {$in: categoryId}}, null, null)
        if (!cards || cards.length === 0) {
            return res.status(404).send({message: `No cards found.`})
        }

        // Format the cards for export
        const formatted = {
            category: category[0].category,
            cardCount: category[0].cardCount,
            cards: cards.map(card => ({
                type: card.type,
                question: card.question,
                answers: card.answers,
                correctAnswer: card.correctAnswer,
            }))
        }

        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment filename="${formatted.category}.json"`)
        res.setHeader('Content-Type', 'application/json')

        // Send the formatted JSON data as a response
        return res.status(200).send(JSON.stringify(formatted, null, 2))
    } catch (error) {
        return res.status(500).send({message: 'Error exporting cards', error: error.message})
    }
})

// Configure Multer for file uploads
// Sets the destination directory for uploaded files to a folder named "uploads" in the current directory
const upload = multer({dest: path.join(__dirname, 'uploads')})

/**
 * Import cards associated with a category.
 * The file is uploaded by the user and should contain a valid JSON format.
 * - Checks if the category already exists for the user. If it does, adds cards to the category.
 * - If the category doesn't exist, creates a new one.
 * - Only imports new cards that don't already exist in the category.
 * POST: localhost:3000/cards/import
 */
router.post('/import', upload.single('file'), async function (req, res) {
    try {
        const userId = req.session.userId
        const file = req.file

        let fileData
        let dbCards
        let dbCategory

        // Validate if a file was uploaded
        if (!file) return res.status(404).send({message: "No file uploaded."})

        // Process and validate the uploaded file
        try {
            const filePath = path.join(__dirname, 'uploads', file.filename)

            const fileContent = fs.readFileSync(filePath, 'utf8')
            fileData = JSON.parse(fileContent)

            // Validate file structure
            if (!fileData.category || !Array.isArray(fileData.cards)) {
                return res.status(400).send({message: "Invalid file format. Ensure it includes category, categoryId, and an array of cards."})
            }
        } catch (error) {
            return res.status(400).send({message: "Failed to process the uploaded file. Ensure it is a valid JSON file."})
        }

        // Check if category already exists for the user
        dbCategory = await Category.findOne({category: fileData.category, userId: userId}, null, null)

        // Create a new category if it doesn't exist yet
        if (!dbCategory) {
            dbCategory = new Category({
                category: fileData.category,
                cardCount: 0,
                userId: userId,
            })
            await dbCategory.save()
        }

        // Retrieve all existing cards of this category
        dbCards = await Card.find({categoryId: {$in: dbCategory._id}}, null, null)

        // Helper function to check if a card is duplicate based on its content
        const isDuplicate = (cardData) => {
            return dbCards.some(card =>
                card.question === cardData.question &&
                card.type === cardData.type &&
                JSON.stringify(card.answers) === JSON.stringify(cardData.answers) &&
                (
                    Array.isArray(card.correctAnswer) && Array.isArray(cardData.correctAnswer)
                        ? JSON.stringify(card.correctAnswer.sort()) === JSON.stringify(cardData.correctAnswer.sort())
                        : card.correctAnswer === cardData.correctAnswer
                )
            )
        }

        // Filter out duplicate cards from the new cards
        const newCardsData = fileData.cards.filter(cardData => !isDuplicate(cardData))

        // Check whether cards need to be imported or are already in the database
        if (newCardsData.length === 0) {
            return res.status(200).send({message: "No new cards to import. All cards are duplicates."})
        }

        // Create the new cards
        const newCards = newCardsData.map(cardData => {
            return new Card({
                categoryId: dbCategory._id,
                type: cardData.type,
                question: cardData.question,
                answers: cardData.answers,
                correctAnswer: cardData.correctAnswer
            })
        })

        // Save the new cards to the database
        const savedCards = await Card.insertMany(newCards)

        // Update the card count for the category
        dbCategory.cardCount += savedCards.length
        await dbCategory.save()

        return res.status(200).send({message: "Cards imported successfully.", savedCards})
    } catch (error) {
        return res.status(500).send({message: "Error importing cards.", error: error.message})
    }
})

module.exports = router