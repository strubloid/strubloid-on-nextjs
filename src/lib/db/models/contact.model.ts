/**
 * Contact Document Model
 * MongoDB schema for contact form submissions
 */

import mongoose, { Schema, Model } from "mongoose";

export interface IContactDocument {
    title: string;
    message: string;
}

const ContactSchema = new Schema<IContactDocument>({
    title: {
        type: String,
        required: [true, "Please add a title"],
        unique: true,
        trim: true,
        maxlength: [40, "Title can't be bigger than 40 characters"],
    },
    message: {
        type: String,
        required: [true, "Please add a message"],
        maxlength: [1000, "Message has a limit of 1000 characters"],
    },
});

const Contact: Model<IContactDocument> =
    mongoose.models.Contact || mongoose.model<IContactDocument>("Contact", ContactSchema);

export default Contact;
