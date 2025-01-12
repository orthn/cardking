const express = require('express');
const router = express.Router();
const Card = require("../models/cardSchema")
const constants = require("node:constants");
const Category = require("../models/categorySchema");
const Statistic = require("../models/statisticSchema");
const { isSameDay, isSameWeek } = require('../controllers/jobManager')
const User = require("../models/userSchema");


router.get('/', function (req, res) {
    res.send("WIP: Default Quiz Page");
});


/**
 * Generates a quiz for a user and returns the quizId with JWT
 * GET: localhost:3000/quiz/startQuiz
 */
router.get('/startQuiz', async function (req, res) {
    if (!req.session.userId) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    const {category} = req.query;
    if (!category) {
        return res.status(400).json({ message: 'Category is required'});
    }
    
    // Fetch user's cards in the selected category
    const userCards = await Card.find({categoryId: category});

    if (!userCards || userCards.length === 0) {
        return res.status(204).json({message: 'No cards available for the selected category'});
    }
    if (userCards.length < 10) {
        return res.status(400).json({message: 'Not enough cards available for the category'});
    }

    const now = new Date();

    const dueCards = userCards.filter(card => new Date(card.nextReview) <= now);

    const remainingSlots = 10 - dueCards.length;
    let additionalCards = [];
    if (remainingSlots > 0) {
        additionalCards = userCards
            .filter(card => new Date(card.nextReview) > now) // Exclude already-due cards
            .sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview)) // Closest review dates first
            .slice(0, remainingSlots); // Fill the remaining slots
    }

    const selectedCards = [...dueCards, ...additionalCards].slice(0, 10);

    if (selectedCards && selectedCards.length === 10) {
        res.status(200).json({selectedCards});
    } else {
        res.status(500).json({message: 'Error during quiz creation'})
    }
});


async function updateStatistics(correctCount, userId){
    try {
        if (isNaN(correctCount) || correctCount < 0) {
            throw new Error("Invalid correctCount value.");
        }

        const quizSuccessRate = (correctCount / 10 ) * 100;

        let statistics = await Statistic.findOneAndUpdate(
            {userId},
            {
                $inc: {completedQuizzes: 1},
                //lastQuizDate: Date.now(),
            },
            {new: true}
        )

        // If category doesn't exist, create a new one
        if (!statistics) {
            statistics = new Statistic({
                userId,
                completedQuizzes: 1,
                lastQuizDate: Date.now(),
                successRate: quizSuccessRate,
                streak: 1
            });

            // Save the new category to the database
            await statistics.save();
            return;
        }

        // update success rate
        const previousSuccessRate = statistics.successRate || 0; // Default to 0 if undefined
        const completedQuizzes = statistics.completedQuizzes;

        const updatedSuccessRate =
            (previousSuccessRate * (completedQuizzes - 1) + quizSuccessRate) / completedQuizzes;

        statistics.successRate = updatedSuccessRate; // Update the success rate

        //update streak
        const currentDate = new Date(Date.now());

        const user = await User.findOne({_id: userId}).select('goal');
        const goal = user ? user.goal : null;

        // for daily goal increment streak if lastQuizDate is not equal now
        if (goal === 'daily' && !isSameDay(currentDate, statistics.lastQuizDate)) {
                statistics.streak++;
        }

        // for weekly goal increment streak if lastQuizDate is not the same week as date.now
        if (goal === 'weekly' && !isSameWeek(currentDate, statistics.lastQuizDate)) {
                statistics.streak++;
        }

        statistics.lastQuizDate = currentDate;

        await statistics.save();
    } catch (error) {
        console.error("Error creating or updating statistics:", error);
        throw new Error("Error creating or updating statistics.")
    }
};

/**
 *  Submit answer of current card and validate it
 *  POST: localhost:3000/quiz/submitAnswers
 *  expected body:
 */
router.post('/submitAnswers', async function (req, res) {
    // get userID from session
    const userId = req.session.userId;

    const {cards, correctCount} = req.body;

    console.log(correctCount);

    const bulkUpdates = [];
    const errors = [];

    for (const submittedCard of cards) {
        if (!submittedCard.cardId) {
            errors.push({cardId: null, message: "ID of the card is required."});
            continue;
        }
        if (typeof submittedCard.quality !== 'number') {
            errors.push({cardId: submittedCard.cardId, message: "Quality score is required and must be a number."});
            continue;
        }

        const card = await Card.findOne({_id: submittedCard.cardId}, null, null);
        if (!card) {
            errors.push({cardId: submittedCard.cardId, message: "Card not found."});
            continue;
        }

        card.reviews++;

        let interval;
        switch (card.reviews) {
            case 1:
                interval = 1;
                break;
            case 2:
                interval = 6;
                break;
            default:
                interval = Math.round(card.interval * card.efactor);
        }

        let efactor =
            card.efactor +
            (0.1 - (5 - submittedCard.quality) * (0.08 + (5 - submittedCard.quality) * 0.02));

        if (efactor < 1.3) {
            efactor = 1.3;
        }

        if (submittedCard.quality < 3) {
            interval = 1;
        } else {
            card.efactor = efactor;
        }

        card.nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000); // Calculate nextReview date

        bulkUpdates.push({
            updateOne: {
                filter: {_id: card._id},
                update: {
                    $set: {
                        interval: card.interval,
                        efactor: card.efactor,
                        nextReview: card.nextReview,
                        reviews: card.reviews,
                    },
                },
            },
        });

    }

    let response;
    // Execute bulk updates
    try {
        if (bulkUpdates.length > 0) {
            await Card.bulkWrite(bulkUpdates);
        }

        // Return success message and any errors encountered
        response = {
            message: "Cards updated successfully.",
            errors: errors.length > 0 ? errors : undefined, // Include errors if any
        };
    } catch (error) {
        console.error("Error updating cards:", error);
        return res.status(500).json({message: "Error updating cards: " + error.message});
    }

    try {
        await updateStatistics(correctCount, userId);
    } catch (error) {
        return res.status(500).json({message: "Error updating statistics: " + error.message});
    }

    return res.status(200).json(response);
});


module.exports = router

