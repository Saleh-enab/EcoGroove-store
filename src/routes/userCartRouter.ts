import * as controller from '../controllers/userCartControllers'
import express from 'express'
import { isAuth } from '../config';

const router = express.Router();

router.get('/add/:id', isAuth, controller.addToCart)

router.get('/checkout', isAuth, controller.checkout)

router.get('/update/:id', isAuth, controller.updateCart)

router.get('/clear', isAuth, controller.clearCart)

router.get('/buynow', isAuth, controller.buyNow)

export = router