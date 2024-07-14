import productModel from "../models/productModel"
import categoryModel from "../models/categoryModel"
import { Request, Response, NextFunction, Express } from "express"
import { body, validationResult } from "express-validator"
import fs from 'fs'
import path from "path"
import { ProductArgs } from "../models/productModel"
import { CustomError } from "../errorHandler"
import { mkdir, rmdir, moveFiles, readFile, writeFile, readDir } from "../config"
import mongoose from "mongoose"
import resizeImg from 'resize-img'
// type CustomRequest = Request & { productId?: mongoose.Types.ObjectId }
type CustomRequest = Request & { productId?: mongoose.Types.ObjectId }

//Showing all products in a the DataBase
const showAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allProducts = await productModel.find({})
        res.render('./admin/products/allProducts', { products: allProducts })
    }
    catch (err) {
        next(err);
    }
}


//Open add product from
const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allCategotioes = await categoryModel.find({})
        const errors = req.flash('error')
        res.render('./admin/products/addProduct', { categories: allCategotioes, errors })
    }
    catch (err) {
        next(err);
    }

}


//Add new product to the database
const postNewProduct = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    try {
        if (!errors.isEmpty()) {
            const errorsArr: string[] = errors.array().map(err => err.msg);
            throw new CustomError(errorsArr, 400)
        } else {
            const id = req.productId
            const title: string = req.body.title
            const description: string = req.body.desc
            const category: string = req.body.category
            const price = Number(req.body.price)
            const image = req.file?.filename

            const product = new productModel({
                _id: id,
                title,
                desc: description,
                category,
                price,
                image
            })

            await product.save()

            // req.productId = product.id
            req.flash('success', "Product has been added successfully")
            res.redirect('/admin/products/allProducts')
        }

    }
    catch (err) {
        next(err);
    }

}


//Open edit product page
const editProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const errors = req.flash('error')
        const product = await productModel.findById(req.params.id)
        const categories = await categoryModel.find({})
        const galleryDir = 'public/images/' + product?.id + '/gallery/thumb'
        const galleryImages = await readDir(galleryDir)
        res.render('./admin/products/editProduct', { product, categories, galleryImages })
    }
    catch (err) {
        next(err)
    }
}

//Update the date of the product in the database
const postEditProduct = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    try {
        if (!errors.isEmpty()) {
            const errorsArr: string[] = errors.array().map(err => err.msg);
            throw new CustomError(errorsArr, 400)
        } else {
            const { title, desc, category, price } = req.body
            let newData: ProductArgs = { title, desc, category, price: Number(price) }

            if (req.file?.filename) {
                try {
                    const product = await productModel.findById(req.params.id)
                    newData.image = req.file.filename
                    fs.unlink(path.join(__dirname, `../../public/images/${product?.id}/${product?.image}`), (err) => {
                        if (err) {
                            return (new CustomError(err.message, 500))
                        }

                    })

                } catch (err) {
                    res.status(500).send("Internal server error")
                }
            }

            await productModel.findByIdAndUpdate(req.params.id, newData)
            req.flash('success', 'Product has been updated successfully')
            res.redirect('/admin/products/allProducts')
        }
    }
    catch (err) {
        next(err);
    }
}


//Upload gallery images
const uploadGallery = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

        console.log(req.body)

        console.log(req.files)

        const id = req.params.id;
        if (req.files && Array.isArray(req.files)) {
            const promises = req.files.map(async (file) => {

                const uploadPath = path.join('public', 'images', id, 'gallery', file.filename);
                const thumbsPath = path.join('public', 'images', id, 'gallery', 'thumb', file.filename);
                await moveFiles(file.path, uploadPath)
                const imgBuffer: any = await readFile(uploadPath)
                const resizedImgBuffer = await resizeImg(imgBuffer, { width: 100, height: 100 });

                await writeFile(thumbsPath, resizedImgBuffer)
            });
            await Promise.all(promises);

            res.sendStatus(200);

        }


    } catch (err) {
        console.error(err);
        next(new CustomError("Failed to upload gallery images", 500));
    }
};


//Delete gallery image

const deleteGalleryImage = (req: Request, res: Response, next: NextFunction) => {

    var originalImage = 'public/images/' + req.query.id + '/gallery/' + req.params.image;
    var thumbImage = 'public/images/' + req.query.id + '/gallery/thumb/' + req.params.image;

    fs.unlink(originalImage, ((err) => {
        if (err) {
            return next(err);
        } else {
            fs.unlink(thumbImage, function (err) {
                if (err) {
                    return next(err);
                } else {
                    req.flash('success', 'Image deleted!');
                    res.redirect('/admin/products/edit-product/' + req.query.id);
                }
            });
        }
    }));
};



//Delete product
const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productModel.findById(req.params.id)
        const productPath = path.join(__dirname, '../../public/images', product?.id)
        if (product?.image) {
            fs.unlink(path.join(__dirname, `../../public/images/${product?.image}`), (err) => {
                if (err) {
                    return next(new CustomError(err.message, 500))
                }
            })

            await rmdir(productPath)
        }

        await productModel.findByIdAndDelete(req.params.id)
        req.flash('success', "Product has been deleted successfully")
        res.redirect('/admin/products/allProducts')
    }
    catch (err) {
        next(err);
    }


}

export { showAllProducts, addProduct, postNewProduct, deleteProduct, editProduct, postEditProduct, uploadGallery, deleteGalleryImage } 
