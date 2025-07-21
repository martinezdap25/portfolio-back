// routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET /projects
// routes/projects.js
router.get('/', async (req, res) => {
    try {
        const {
            category,
            technology,
            year,
            favoritesOrFeatured,
            orderBy,
            lang = 'es',  // por defecto español
            page = 1,
            limit = 6,
        } = req.query;

        // Filtros dinámicos
        const filters = {};

        // Categorías: puede venir como string con comas
        if (category) {
            const categories = category.split(',');
            filters.category = { $in: categories };
        }

        // Tecnologías: puede venir como string con comas
        if (technology) {
            const techs = technology.split(',');
            filters.technologies = { $all: techs };
        }

        // Año: filtro por createdAt (solo año)
        if (year) {
            const start = new Date(`${year}-01-01T00:00:00.000Z`);
            const end = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);
            filters.createdAt = { $gte: start, $lt: end };
        }

        // Favoritos / Destacados (featured)
        if (favoritesOrFeatured === 'Sí') {
            filters.featured = true;
        } else if (favoritesOrFeatured === 'No') {
            filters.featured = false;
        }

        // Orden dinámico
        let sort = {};
        switch (orderBy) {
            case 'Más reciente':
                sort = { createdAt: -1 };
                break;
            case 'Más antiguo':
                sort = { createdAt: 1 };
                break;
            case 'Nombre (A-Z)':
                // Ordenar por título según el idioma solicitado
                sort = { [`title.${lang}`]: 1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        // Paginación
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Project.countDocuments(filters);
        const projects = await Project.find(filters)
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sort);

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
