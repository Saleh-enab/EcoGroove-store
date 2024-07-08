import express from 'express'
import * as path from 'path'
import morgan from 'morgan'
import * as config from './config'
import product from './models/appModel'
import mongoose from 'mongoose'
import userRouter from './routes/userRoutes'
import adminRouter from './routes/adminRoutes'
import session from 'express-session'
import flash from 'connect-flash'

const app = express();

//Setting up the app
app.set('view engine', 'ejs')
app.set('layout', './layouts/main')


//Setting up the middlewares
app.use(express.static(path.join(__dirname, '../public')))
app.use(morgan('tiny'))
app.use('/users', userRouter)
app.use('/admin', adminRouter)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}))

app.use(flash)

const port = config.port
const dbURI = config.dbURI


if (dbURI === undefined) {
    console.log('Error while connecting to the Datebase')
} else {
    (async () => {
        try {
            await mongoose.connect(dbURI)
            app.listen(port, () => {
                console.log("App runs successfully...")
            })

        } catch (err) {
            console.log(err)
        }

    })();
}