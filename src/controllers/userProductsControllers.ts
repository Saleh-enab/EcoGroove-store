import { Request, Response, NextFunction } from "express";
import pageModel from "../models/pageModel";
import categoryModel from "../models/categoryModel";
import { CustomError } from "../errorHandler";
import productModel from "../models/productModel";



//Get all products
const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pages = await pageModel.find({})
        const categories = await categoryModel.find({})
        const products = await productModel.find({})
        const title = "All Products"
        res.render('./user/products', { title, products, pages, categories })
    }
    catch (err) {
        next(err);
    }
}

//Get category products
const getCategoryProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categorySlug = req.params.category
        const pages = await pageModel.find({})
        const categories = await categoryModel.find({})
        const products = await productModel.find({ category: categorySlug })
        const category = await categoryModel.findOne({ slug: categorySlug })
        res.render('./user/products', { title: category?.title, products, pages, categories })
    }
    catch (err) {
        next(err);
    }
}

export { getAllProducts, getCategoryProducts }