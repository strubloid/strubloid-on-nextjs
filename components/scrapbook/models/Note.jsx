const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title : {
        type : String,
        required: [ true, 'PLease add a title'],
        unique: true,
        trim: true,
        maxlength: [40, "Title can't be bigger than 40 characters"],
    },
    description : {
        type : String,
        required: [ true, 'PLease add a description'],
        maxlength: [200, 'Message has a limit of 1000 characters'],
    }
});

module.exports = mongoose.models.Note || mongoose.model('Note', NoteSchema);