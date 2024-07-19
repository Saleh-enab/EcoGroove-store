import { Request, Response, NextFunction } from "express";
import pageModel from "../models/pageModel";
import categoryModel from "../models/categoryModel";
import productModel from "../models/productModel";
import { readDir } from "../config";



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


//Get product details
const getProductPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productModel.findById(req.params.id)
        const pages = await pageModel.find({})
        const categories = await categoryModel.find({})
        const galleryPath = `public/images/${product?.id}/gallery/thumb`
        const galleryImages = await readDir(galleryPath)
        const title = product?.title

        res.render('./user/productPage', { title, pages, categories, p: product, galleryImages })
    }
    catch (err) {
        next(err);
    }
}



export { getAllProducts, getCategoryProducts, getProductPage }