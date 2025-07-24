// routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Category = require('../models/Category');
const Technology = require('../models/Technology');
const Image = require('../models/Image');
const mongoose = require('mongoose');

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
            // Si es un ID válido, usarlo directamente
            if (mongoose.Types.ObjectId.isValid(category)) {
                filters.category = category;
            } else {
                // Si es nombre, buscar el ID correspondiente
                const categoryDoc = await Category.findOne({ name: category }).select('_id');
                if (!categoryDoc) {
                    return res.status(400).json({ message: 'Categoría no encontrada' });
                }
                filters.category = categoryDoc._id;
            }
        }

        if (technology) {
            const techNames = technology.split(',');
            const techDocs = await Technology.find({ name: { $in: techNames } }).select('_id');
            const techIds = techDocs.map(t => t._id);

            // Si no se encontraron todas las tecnologías solicitadas, ningún proyecto puede coincidir.
            if (techIds.length !== techNames.length) {
                return res.json({ data: [], total: 0, page: 1, pages: 0 });
            }

            if (techIds.length > 0) {
                filters.technologies = { $all: techIds };
            }
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
            .populate('technologies')
            .populate('category')
            .populate('images');

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

// GET /projects/technologies - Obtener tecnologías disponibles para filtros
router.get('/technologies', async (req, res) => {
    try {
        // Esto devuelve solo las tecnologías que están realmente en uso en al menos un proyecto.
        const usedTechIds = await Project.distinct('technologies');
        const technologies = await Technology.find({ '_id': { $in: usedTechIds } }).sort({ name: 1 });
        res.json(technologies);
    } catch (err) {
        console.error('Error al obtener las tecnologías:', err);
        res.status(500).json({ message: 'Error al obtener las tecnologías', error: err.message });
    }
});

// GET /projects/categories - Obtener categorías disponibles para filtros
router.get('/categories', async (req, res) => {
    try {
        // Esto devuelve solo las categorías que están realmente en uso en al menos un proyecto.
        const usedCatIds = await Project.distinct('category');
        const categories = await Category.find({ '_id': { $in: usedCatIds } }).sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error('Error al obtener las categorías:', err);
        res.status(500).json({ message: 'Error al obtener las categorías', error: err.message });
    }
});

// GET /projects/years - Obtener años de proyectos para filtros
router.get('/years', async (req, res) => {
    try {
        const result = await Project.aggregate([
            { $project: { year: { $year: { $toDate: "$createdAt" } } } },
            { $group: { _id: '$year' } },
            { $sort: { _id: -1 } }
        ]);
        const years = result.map(item => item._id.toString());
        res.json(years);
    } catch (err) {
        console.error('Error al obtener los años:', err);
        res.status(500).json({ message: 'Error al obtener los años', error: err.message });
    }
});

// GET /projects/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de proyecto inválido' });
        }

        const project = await Project.findById(id)
            .populate('technologies')
            .populate('category')
            .populate('images');

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        res.json(project);
    } catch (err) {
        // Es una buena práctica registrar el error completo en la consola para depuración
        console.error('Error al obtener el proyecto por ID:', err);
        res.status(500).json({ message: 'Error interno del servidor al obtener el proyecto', error: err.message });
    }
});

module.exports = router;
