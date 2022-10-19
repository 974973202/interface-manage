const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const interfaceSchema = new Schema({
    __v: { type: Number, select: false },
    version: { type: [{
        type: Schema.Types.ObjectId,
        ref: 'Version',
        required: true,
    }] },
    // version: { type: String },
    module: { type: [{
        type: Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
    }] },
    interfaceAddress: { type: String },
    interfaceUse: { type: String },
    remarks: { type: String },
    person: { type: String },
    parameter: { type: [String] },
    data: { type: Date, default: Date.now },
})

module.exports = model('Interface', interfaceSchema)