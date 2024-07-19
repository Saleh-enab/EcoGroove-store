import * as controller from '../controllers/userProductsControllers'
import express from 'express'
const router = express.Router();
import { isAuth } from '../config';

router.get('/', isAuth, controller.getAllProducts)


router.get('/:category', isAuth, controller.getCategoryProducts)

router.get('/:category/:id', isAuth, controller.getProductPage)

export = router