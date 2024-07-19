import * as controller from '../controllers/adminCategoryControllers'
import express from 'express'
import { check } from 'express-validator';
const router = express.Router();
import { isAdmin } from '../config';



router.get('/allCategories', isAdmin, controller.showAllCategoroies)

router.get('/add-category', isAdmin, controller.addCategory)


router.post('/add-category', isAdmin, [
    check("title")
        .notEmpty()
        .withMessage("Title must have a value"),
], controller.postNewCategory)


router.get('/edit-category/:id', isAdmin, controller.editCateory)

router.post('/edit-category/:id', isAdmin, [
    check("title")
        .notEmpty()
        .withMessage("Title must have a value"),
], controller.postEditCategory)

router.delete('/delete-category/:id', isAdmin, controller.deleteCategory)


export = router