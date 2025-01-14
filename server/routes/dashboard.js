const express = require('express');
const router = express.Router();

const Category = require('../models/categorySchema');
const Statistic = require("../models/statisticSchema");

/**
 * Returns all categories a user has
 * GET: localhost:3000/dashboard/categories
 */
router.get('/categories', async function (req, res) {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const categories = await Category.find({userId: userId});
        if (!categories || categories.length === 0) {
            return res.status(204).json([]); // wenn keine Kategorien vorhanden sind
        }
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
});

/**
 * Retrieves statistics for one user
 */
router.get('/statistics', async function (req, res) {
    const userId = req.body.userId;

    if (!userId) return res.status(401).json({message: 'Unauthorized'})

    try {
        const statistics = await Statistic.find({userId: userId}, null, null)

        if (!statistics) return res.status(404).send({message: 'No statistics found'});
        const result = statisticFormatter(statistics);

        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({message: 'Internal server error', error: error.message});
    }
})

router.get('/all-statistics', async function (req, res) {
    try {
        const statistics = await Statistic.find(null, null, null)
        const result = statisticFormatter(statistics);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({message: 'Internal server error', error: error.message});
    }
})

const statisticFormatter = (data) => {
    return data.map(item => ({
        userId: item.userId,
        completedQuizzes: item.completedQuizzes,
        streak: item.streak,
        successRate: item.successRate,
    }));
};

module.exports = router