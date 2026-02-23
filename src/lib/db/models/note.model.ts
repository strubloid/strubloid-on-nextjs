/**
 * Note Document Model
 * MongoDB schema for scrapbook notes
 */

import mongoose, { Schema, Model } from "mongoose";

export interface INoteDocument {
    title: string;
    description: string;
}

const NoteSchema = new Schema<INoteDocument>({
    title: {
        type: String,
        required: [true, "Please add a title"],
        unique: true,
        trim: true,
        maxlength: [40, "Title can't be bigger than 40 characters"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [200, "Description has a limit of 200 characters"],
    },
});

const Note: Model<INoteDocument> = mongoose.models.Note || mongoose.model<INoteDocument>("Note", NoteSchema);

export default Note;
