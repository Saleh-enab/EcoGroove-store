import * as controller from '../controllers/uersPagesController'
import express from 'express'
const router = express.Router();

router.get('/', controller.getHome)

router.get('/:slug', controller.getPage)


export = router