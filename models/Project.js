// models/Project.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    title: {
        es: { type: String, required: true },
        en: { type: String, required: true }
    },
    description: {
        es: { type: String, required: true },
        en: { type: String, required: true }
    },
    shortDescription: {
        es: { type: String },
        en: { type: String }
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Image'
    }],
    repositoryUrl: String,
    deployUrl: String,
    technologies: [{
        type: Schema.Types.ObjectId,
        ref: 'Technology',
        required: true
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['completed', 'in-progress'], default: 'completed' },
    challenges: {
        es: [String],
        en: [String]
    },
    learnings: {
        es: [String],
        en: [String]
    },
    features: {
        es: [String],
        en: [String]
    },
    role: {
        es: { type: String },
        en: { type: String }
    },
    duration: {
        es: { type: String },
        en: { type: String }
    },
    teamSize: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
