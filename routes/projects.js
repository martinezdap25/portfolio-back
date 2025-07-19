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

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el proyecto', error: err });
    }
});

module.exports = router;
