const express = require('express');
const router = express.Router();
const Technology = require('../models/Technology');

// GET /technologies
router.get('/', async (req, res) => {
    try {
        const technologies = await Technology.find().populate('category');
        res.status(200).json(technologies);
    } catch (error) {
        console.error('Error al obtener tecnologías:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;