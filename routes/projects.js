// routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET /projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los proyectos', error: err });
    }
});

module.exports = router;
