import mongoose, { Document, Schema } from "mongoose";

// Define the interface
interface ICategory extends Document {
    title: string;
    slug: string;
}

// Define the Mongoose schema
const categorySchema: Schema<ICategory> = new Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String
    }
});

// Create the Mongoose model
const categoryModel = mongoose.model<ICategory>('category', categorySchema);

export default categoryModel;