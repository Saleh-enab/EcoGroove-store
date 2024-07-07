import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({

})

const product = mongoose.model('product', productSchema)

export = product