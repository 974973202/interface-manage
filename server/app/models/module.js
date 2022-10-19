const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const moduleSchema = new Schema({
    __v: { type: Number, select: false },
    moduleName: { type: String, required: true }, // select: false
    remarks: { type: String },
    person: { type: String },
    data: { type: Date, default: Date.now },
})

module.exports = model('Module', moduleSchema)