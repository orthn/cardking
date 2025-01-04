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

    let categories = await Category.find({userId: userId}, null, null);

    console.log(categories)
    if (categories) return res.status(200).json(categories)
    else return res.status(204).json({message: 'No categories found'})
});

module.exports = router