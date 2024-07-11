import * as controller from '../controllers/adminProductsController'
import express from 'express'
import multer, { FileFilterCallback } from 'multer';
import path from 'path'
import { check } from 'express-validator'
import categoryModel from '../models/categoryModel'

const categoryExists = async (value: string) => {
    const cat = await categoryModel.findOne({ title: value })
    return (cat ? true : false)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

// // File filter to allow only specific file types
// const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//     const allowedTypes = ['.jpg', '.jpeg', '.png'];
//     const fileExt = path.extname(file.originalname).toLowerCase();
//     if (allowedTypes.includes(fileExt)) {
//         cb(null, true); // Accept file
//     } else {
//         cb(null,false); // Reject file
//     }
// };

const upload = multer({ storage })

const router = express.Router()

router.get('/allProducts', controller.showAllProducts)

router.get('/add-product', controller.addProduct)

router.post('/add-product', upload.single("image"), [
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

router.post('/edit-product/:id', upload.single("image"), [
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