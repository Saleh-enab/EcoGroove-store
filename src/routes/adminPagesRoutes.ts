import * as controller from '../controllers/adminPagesControllers'
import express from 'express'
import { check } from 'express-validator';
const router = express.Router();

router.get('/', controller.getHome)

router.get('/allPages', controller.showAllPages)

router.get('/add-page', controller.addPage)


router.post('/add-page', [
    check("title")
        .notEmpty()
        .withMessage("Title must have a value"),

    check("content")
        .notEmpty()
        .withMessage("Content must have a value")
], controller.postNewPage)


router.get('/edit-page/:id', controller.editPage)

router.post('/edit-page/:id', [
    check("title")
        .notEmpty()
        .withMessage("Title must have a value"),

    check("content")
        .notEmpty()
        .withMessage("Content must have a value")
], controller.postEditPage)

router.delete('/delete-page/:id', controller.deletePage)


export = router