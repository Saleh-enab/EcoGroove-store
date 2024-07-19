import mongoose, { Document, Schema } from "mongoose";

// Define the interface
export interface IUser extends Document {
    name: string;
    email: string;
    username: string;
    password: string;
    admin: boolean;
}

// Define the Mongoose schema
const pageSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true,
    },
});

// Create the Mongoose model
const userModel = mongoose.model<IUser>('User', pageSchema);

export default userModel;