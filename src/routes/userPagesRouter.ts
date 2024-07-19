import * as controller from '../controllers/uersPagesController'
import express from 'express'
const router = express.Router();
import { isAuth } from '../config';

router.get('/', isAuth, controller.getHome)

router.get('/:slug', isAuth, controller.getPage)


export = router