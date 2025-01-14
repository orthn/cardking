const express = require('express')
const router = express.Router()

const Category = require('../models/categorySchema')
const Statistic = require("../models/statisticSchema")

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
        const categories = await Category.find({userId: userId})
        if (!categories || categories.length === 0) {
            return res.status(204).json([]) // wenn keine Kategorien vorhanden sind
        }
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})

/**
 * Retrieves statistics for a single user
 * GET: localhost:3000/cards/statistics
 */
router.get('/statistics', async function (req, res) {
    const userId = req.session.userId
    if (!userId) return res.status(401).json({message: 'Unauthorized'})

    try {
        const statistics = await Statistic.find({userId: userId}, null, null)

        if (!statistics || statistics.length === 0) {
            return res.status(404).send({message: 'No statistics found'})
        }

        return res.status(200).send(statisticFormatter(statistics))
    } catch (error) {
        return res.status(500).send({message: 'Internal server error', error: error.message})
    }
})

/**
 * Retrieves statistsics for all users
 * GET: localhost:3000/cards/all-statistics
 */
router.get('/all-statistics', async function (req, res) {
    try {
        const statistics = await Statistic.find(null, null, null)
        return res.status(200).send(statisticFormatter(statistics))
    } catch (error) {
        return res.status(500).send({message: 'Internal server error', error: error.message})
    }
})

/**
 * Formats statistics data to include only relevant fields
 * @param {Array} data - Array of statistic objects
 * @returns {Array} - Formatted array with selected fields
 */
const statisticFormatter = (data) => {
    return data.map(item => ({
        userId: item.userId,
        completedQuizzes: item.completedQuizzes,
        streak: item.streak,
        successRate: item.successRate,
    }))
}

module.exports = router