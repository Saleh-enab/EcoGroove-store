import * as controller from '../controllers/adminProductsController';
import express ,{Request,Response,NextFunction}from 'express'
import { check } from 'express-validator'
import categoryModel from '../models/categoryModel'
import { uploadMiddleware } from '../config';

const router = express.Router()


const categoryExists = async (value: string) => {
    const cat = await categoryModel.findOne({ title: value })
    return (cat ? true : false)
}


router.get('/allProducts', controller.showAllProducts)

router.get('/add-product', controller.addProduct)

router.post('/add-product', uploadMiddleware, [
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

router.delete('/delete-product/:id', controller.deleteProduct)

export = router



// router.post('/add-product', (req: Request, res: Response, next: NextFunction) => {
    
// }, [
//     check("title")
//         .notEmpty()
//         .escape()
//         .withMessage("Title must have a value"),
//     check("desc")
//         .notEmpty()
//         .escape()
//         .withMessage("Description must have a value"),
//     check("category")
//         .custom(categoryExists)
//         .escape()
//         .withMessage("Category chosen is invalid"),
//     check("price")
//         .isNumeric()
//         .withMessage("Price is invalid number"),
// ], controller.postNewProduct);



