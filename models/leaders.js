'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        defalt:false
    }
}, {
    timestamps:true
});

var Leaders = mongoose.model('Leader', leadersSchema);
module.exports = Leaders;