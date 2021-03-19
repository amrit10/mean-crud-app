const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    eid: {
        type: Number,
        default: 0,
        unique: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    dob: {
        type: Date,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    skills: [{
        type: String
    }],
    photo: {
        type: String,
        required: true
    }
});

employeeSchema.plugin(AutoIncrement, {inc_field: 'eid'});

module.exports = mongoose.model('Employee', employeeSchema);

