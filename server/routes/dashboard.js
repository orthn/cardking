const express = require('express')
const router = express.Router()

const Category = require('../models/categorySchema')
const Statistic = require("../models/statisticSchema")
const User = require("../models/userSchema");

/**
 * Returns all categories a user has
 * GET: localhost:3000/dashboard/categories
 */
router.get('/categories', async function (req, res) {
    const userId = req.session.userId
    if (!userId) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    try {
        const categories = await Category.find({userId: userId}, null, null)
        if (!categories || categories.length === 0) {
            return res.status(204).json([]) // wenn keine Kategorien vorhanden sind
        }
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})

/**
 *  Retrieves statistics for a user or all users
 * GET: /dashboard/statistics
 */
router.get('/statistics', async function (req, res) {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const filterBy = req.query.filter || 'default'; // Filter für das Leaderboard
    const userId = req.session.userId; // Benutzer-ID aus der Session
    const includeAll = req.query.all === 'true'; // Überprüft, ob alle Statistiken benötigt werden

    try {
        let statistics;

        if (includeAll) {
            // Wenn 'all=true' übergeben wurde, gebe alle Statistiken zurück (z. B. für Leaderboard)
            statistics = await Statistic.find({});
        } else {
            // Andernfalls nur die Statistiken des aktuellen Benutzers
            statistics = await Statistic.find({ userId: userId });
        }

        if (!statistics || statistics.length === 0) {
            return res.status(404).send({ message: 'No statistics found' });
        }

        // Daten formatieren und zurückgeben
        return res.status(200).send(statisticFormatter(statistics, filterBy));
    } catch (error) {
        console.error('Fehler beim Abrufen der Statistiken:', error);
        return res.status(500).send({ message: 'Internal server error', error: error.message });
    }
});


/**
 * Formats statistics data to include only relevant fields based on a filter criterion
 * @param {any} data - Array of statistic objects
 * @param {string} formatBy - The field to filter by (e.g., "completedQuizzes", "streak", "successRate")
 * @returns {Array} - Formatted array with selected fields
 */
const statisticFormatter = (data, formatBy) => {
    return data.map(item => {
        let formattedItem = {userId: item.userId};

        switch (formatBy.toLowerCase()) {
            case 'completedquizzes':
                formattedItem.completedQuizzes = item.completedQuizzes; break;
            case 'streak':
                formattedItem.streak = item.streak; break;
            case 'successrate':
                formattedItem.successRate = item.successRate; break;
            default:
                formattedItem = {
                    userId: item.userId,
                    completedQuizzes: item.completedQuizzes,
                    streak: item.streak,
                    successRate: item.successRate,
                };
                break;
        }
        return formattedItem;
    });
};

module.exports = router