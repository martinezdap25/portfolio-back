// routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Category = require('../models/Category'); // 👈 IMPORTANTE
const Technology = require('../models/Technology'); // 👈 IMPORTANTE

// GET /projects
router.get('/', async (req, res) => {
    try {
        const {
            category,
            technology,
            year,
            favoritesOrFeatured,
            orderBy,
            lang = 'es',
            page = 1,
            limit = 6,
        } = req.query;

        const filters = {};

        if (category) {
            const categories = category.split(',');
            filters.category = { $in: categories };
        }

        if (technology) {
            const techs = technology.split(',');
            filters.technologies = { $all: techs };
        }

        if (year) {
            const start = new Date(`${year}-01-01T00:00:00.000Z`);
            const end = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);
            filters.createdAt = { $gte: start, $lt: end };
        }

        if (favoritesOrFeatured === 'Sí') {
            filters.featured = true;
        } else if (favoritesOrFeatured === 'No') {
            filters.featured = false;
        }

        let sort = {};
        switch (orderBy) {
            case 'Más reciente':
                sort = { createdAt: -1 };
                break;
            case 'Más antiguo':
                sort = { createdAt: 1 };
                break;
            case 'Nombre (A-Z)':
                sort = { [`title.${lang}`]: 1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Project.countDocuments(filters);

        const projects = await Project.find(filters)
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sort)
            .populate('technologies') // 👈 Esto ahora funcionará
            .populate('category');    // 👈 Y esto también

        res.json({
            data: projects,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los proyectos', error: err.message });
    }
});

// GET /projects/:id
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('technologies')
            .populate('category');

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el proyecto', error: err.message });
    }
});

module.exports = router;
