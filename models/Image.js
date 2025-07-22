// models/Image.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: { type: String, required: true },
  alt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);
