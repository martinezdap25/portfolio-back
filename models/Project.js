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
    images: [String],
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
    featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
