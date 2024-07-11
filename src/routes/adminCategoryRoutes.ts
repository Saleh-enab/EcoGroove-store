import * as controller from '../controllers/adminCategoryControllers'
import express from 'express'
import { check } from 'express-validator';
const router = express.Router();


router.get('/allCategories', controller.showAllCategoroies)

router.get('/add-category', controller.addCategory)


router.post('/add-category', [
    check("title")
        .notEmpty()
        .withMessage("Title must have a value"),
], controller.postNewCategory)


router.get('/edit-category/:id', controller.editCateory)

router.post('/edit-category/:id', controller.postEditCategory)

router.delete('/delete-category/:id', controller.deleteCategory)


export = router