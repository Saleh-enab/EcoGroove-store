import * as controller from '../controllers/userControllers'
import express from 'express'
const router = express.Router();

router.get('/', controller.getHome)

export = router