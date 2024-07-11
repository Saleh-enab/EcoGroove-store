import mongoose, { Document, Schema } from "mongoose";

// Define the interface
interface IPage extends Document {
    title: string;
    slug: string;
    content: string;
}

// Define the Mongoose schema
const pageSchema: Schema<IPage> = new Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
});

// Create the Mongoose model
const pageModel = mongoose.model<IPage>('Page', pageSchema);

export default pageModel;