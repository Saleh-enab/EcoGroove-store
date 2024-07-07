import express from 'express'
import * as path from 'path'
import morgan from 'morgan'
import dotenv from 'dotenv'
import product = require('./models/appModel')
import mongoose from 'mongoose'

dotenv.config()
const app = express();

//Setting up the app
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


//Setting up the middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('tiny'))

const port = Number(process.env.PORT || 3000)
const dbURI = process.env.mongoURI


if (dbURI == undefined) {
    console.log('Error while connection to the Datebase')
} else {
    async () => {
        try {
            await mongoose.connect(dbURI)
            app.listen(port, () => {
                console.log("App runs successfully...")
            })

        } catch (err) {
            console.log(err)
        }

    }
}