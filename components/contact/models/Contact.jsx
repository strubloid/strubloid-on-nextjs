const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    title : {
        type : String,
        required: [ true, 'PLease add a title'],
        unique: true,
        trim: true,
        maxlength: [40, "Title can't be bigger than 40 characters"],
    },
    message : {
        type : String,
        required: [ true, 'PLease add a message'],
        maxlength: [1000, 'Message has a limit of 1000 characters'],
    }
});

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);