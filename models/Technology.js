// models/Technology.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TechnologySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    iconUrl: {
        type: String,
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Technology', TechnologySchema);
