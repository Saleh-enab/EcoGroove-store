import * as controller from '../controllers/adminProductsController';
import express, { Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'
import categoryModel from '../models/categoryModel'
import { uploadMiddleware, uploadGalleryMiddleware, createImagesFolders } from '../config';

const router = express.Router()


const categoryExists = async (value: string) => {
    const cat = await categoryModel.findOne({ title: value })
    return (cat ? true : false)
}


router.get('/allProducts', controller.showAllProducts)

router.get('/add-product', controller.addProduct)

router.post('/add-product', createImagesFolders, uploadMiddleware, [
    check("title")
        .notEmpty()
        .escape()
        .withMessage("Title must have a value"),
    check("desc")
        .notEmpty()
        .escape()
        .withMessage("Description must have a value"),
    check("Category")
        .custom(categoryExists)
        .escape()
        .withMessage("Category choosed is invalid"),
    check("price")
        .isNumeric()
        .withMessage("Price is invalid number"),
], controller.postNewProduct)

router.post('/product-gallery/:id', uploadGalleryMiddleware, controller.uploadGallery)


router.get('/edit-product/:id', controller.editProduct)

router.post('/edit-product/:id', uploadMiddleware, [
    check("title")
        .notEmpty()
        .escape()
        .withMessage("Title must have a value"),
    check("desc")
        .notEmpty()
        .escape()
        .withMessage("Description must have a value"),
    check("Category")
        .custom(categoryExists)
        .escape()
        .withMessage("Category choosed is invalid"),
    check("price")
        .isNumeric()
        .withMessage("Price is invalid number"),
], controller.postEditProduct)

router.get('/delete-image/:image', controller.deleteGalleryImage)

router.delete('/delete-product/:id', controller.deleteProduct)

export = router