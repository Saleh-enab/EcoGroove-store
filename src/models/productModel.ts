import mongoose, { Document, Schema } from "mongoose";

// Define the interface
export interface ProductArgs {
    title: string;
    desc: string;
    category: string;
    price: number;
    image?: string;
}

interface IProduct extends ProductArgs, Document { }

// Define the Mongoose schema
const productSchema: Schema<IProduct> = new Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    }
});

// Create the Mongoose model
const productModel = mongoose.model<IProduct>('Product', productSchema);

export default productModel;