// models/Project.js  
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        es: { type: String, required: true },
        en: { type: String, required: true }
    },
    description: {
        es: { type: String, required: true },
        en: { type: String, required: true }
    },
    shortDescription: {
        es: String,
        en: String
    },
    features: {
        es: [String],
        en: [String]
    },
    challenges: {
        es: [String],
        en: [String]
    },
    learnings: {
        es: [String],
        en: [String]
    },
    role: {
        es: String,
        en: String
    },
    duration: {
        es: String,
        en: String
    },
    technologies: [String],
    category: String,
    status: {
        type: String,
        enum: ['completed', 'in-progress', 'archived'],
        default: 'completed'
    },
    featured: { type: Boolean, default: false },
    images: [
        {
            url: String,
            alt: String
        }
    ],
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);