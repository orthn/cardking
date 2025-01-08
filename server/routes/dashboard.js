const express = require('express');
const router = express.Router();
const Category = require('../models/categorySchema');

/**
 * Returns all categories a user has
 * GET: localhost:3000/dashboard/categories
 */
router.get('/categories', async function(req, res){
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const categories = await Category.find({ userId: userId });
        if (!categories || categories.length === 0) {
            return res.status(204).json([]); // wenn keine Kategorien vorhanden sind
        }
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router