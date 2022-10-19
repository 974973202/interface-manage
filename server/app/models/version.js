const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const versionSchema = new Schema({
    __v: { type: Number, select: false },
    version: { type: String, required: true }, // select: false
    module: { type: [{
        type: Schema.Types.ObjectId,
        ref: 'Module',
        select: false,
    }] },
    data: { type: Date, default: Date.now },
    person: { type: String },
    remarks: { type: String },
})

module.exports = model('Version', versionSchema)