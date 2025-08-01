// routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Category = require('../models/Category');
const Technology = require('../models/Technology');
const Image = require('../models/Image');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        let { page = 1, limit = 6, category, technology, year, featured, sort } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const filter = {};
        if (category) {
            const categoryArray = Array.isArray(category) ? category : [category];
            filter.category = { $in: categoryArray.map(id => new mongoose.Types.ObjectId(id)) };
        }

        if (technology) {
            const technologyArray = Array.isArray(technology) ? technology : [technology];
            // Usamos $all para que el proyecto deba tener TODAS las tecnologías seleccionadas (lógica "AND").
            filter.technologies = { $all: technologyArray.map(id => new mongoose.Types.ObjectId(id)) };
        }

        if (year) {
            const yearArray = (Array.isArray(year) ? year : [year]).map(y => parseInt(y, 10));
            // Usamos $expr para poder aplicar funciones de agregación como $year en una consulta find.
            // Como 'createdAt' es un String, primero lo convertimos a Date con $toDate.
            filter.$expr = {
                $in: [{ $year: { $toDate: '$createdAt' } }, yearArray]
            };
        }

        // Nuevo filtro para proyectos destacados (favoritos)
        if (featured != null) {
            filter.featured = (featured === 'true');
        }

        // Opciones de ordenamiento dinámico
        const sortOption = {};
        switch (sort) {
            case 'featured':
                sortOption.featured = -1;
                sortOption.createdAt = -1;
                break;
            case 'oldest':
            case 'year_asc':
                sortOption.createdAt = 1;
                break;
            case 'newest':
            case 'year_desc':
                sortOption.createdAt = -1;
                break;
            case 'name_asc':
                sortOption['title.es'] = 1;
                break;
            case 'name_desc':
                sortOption['title.es'] = -1;
                break;
            default:
                sortOption.createdAt = -1;
                break;
        }

        const total = await Project.countDocuments(filter);

        const projects = await Project.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sortOption)
            .populate('technologies')
            .populate('category')
            .populate('images');

        res.json({
            data: projects,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error('❌ Error en GET /projects:', err);
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
        // Devolvemos solo las categorías que están realmente en uso en al menos un proyecto.
        const usedCategoryIds = await Project.distinct('category');
        const categories = await Category.find({ '_id': { $in: usedCategoryIds } }).sort({ name: 1 }); // ordena alfabéticamente
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
