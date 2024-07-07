import * as controller from '../controllers/appControllers'
import express from 'express'
const router = express.Router();

router.get('/', controller.getHome)

export = router