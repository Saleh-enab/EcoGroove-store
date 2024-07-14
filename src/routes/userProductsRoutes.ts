import * as controller from '../controllers/userProductsControllers'
import express from 'express'
const router = express.Router();

router.get('/', controller.getAllProducts)


router.get('/:category', controller.getCategoryProducts)

export = router