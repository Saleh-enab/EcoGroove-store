import * as controller from '../controllers/adminControllers'
import express from 'express'
const router = express.Router();

router.get('/', controller.getHome)

router.get('/add-page', controller.addPage)
export = router