// models/Project.js  
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: String, // Para tarjetas  
    url: String,
    githubUrl: String,
    technologies: [String],
    category: String, // Frontend, Backend, Fullstack, etc.  
    status: {
        type: String,
        enum: ['completed', 'in-progress', 'archived'],
        default: 'completed'
    },
    featured: { type: Boolean, default: false },
    images: [{
        url: String,
        alt: String,
        isMain: { type: Boolean, default: false }
    }],
    features: [String],
    role: String, // Tu rol en el proyecto  
    teamSize: Number,
    duration: String, // "3 meses", "6 semanas", etc.  
    challenges: [String],
    learnings: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);