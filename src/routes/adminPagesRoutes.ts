import * as controller from '../controllers/adminPagesControllers'
import express from 'express'
import { check } from 'express-validator';
const router = express.Router();
import { isAdmin } from '../config';


router.get('/', isAdmin, controller.showAllPages)

router.get('/add-page', isAdmin, controller.addPage)


router.post('/add-page', isAdmin, [
    check("title")
        .notEmpty()
        .withMessage("Title must have a value"),

    check("content")
        .notEmpty()
        .withMessage("Content must have a value")
], controller.postNewPage)


router.get('/edit-page/:id', isAdmin, controller.editPage)

router.post('/edit-page/:id', isAdmin, [
    check("title")
        .notEmpty()
        .withMessage("Title must have a value"),

    check("content")
        .notEmpty()
        .withMessage("Content must have a value")
], controller.postEditPage)

router.delete('/delete-page/:id', isAdmin, controller.deletePage)


export = router