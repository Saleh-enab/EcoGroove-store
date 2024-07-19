import * as controller from '../controllers/adminProductsController';
import express, { Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'
import categoryModel from '../models/categoryModel'
import { uploadMiddleware, uploadGalleryMiddleware, createImagesFolders, isAdmin } from '../config';

const router = express.Router()


const categoryExists = async (value: string) => {
    const cat = await categoryModel.findOne({ title: value })
    return (cat ? true : false)
}


router.get('/allProducts', isAdmin, controller.showAllProducts)

router.get('/add-product', isAdmin, controller.addProduct)

router.post('/add-product', isAdmin, createImagesFolders, uploadMiddleware, [
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

router.post('/product-gallery/:id', isAdmin, uploadGalleryMiddleware, controller.uploadGallery)


router.get('/edit-product/:id', isAdmin, controller.editProduct)

router.post('/edit-product/:id', isAdmin, uploadMiddleware, [
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

router.get('/delete-image/:image', isAdmin, controller.deleteGalleryImage)

router.delete('/delete-product/:id', isAdmin, controller.deleteProduct)

export = router