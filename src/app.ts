import express from 'express'
import * as path from 'path'
import morgan from 'morgan'
import * as config from './config'
import mongoose from 'mongoose'
import userPagesRouter from './routes/userPagesRouter'
import userProductsRouter from './routes/userProductsRoutes'
import pagesRouter from './routes/adminPagesRoutes'
import categoryRouter from './routes/adminCategoryRoutes'
import productsRouter from './routes/adminProductRouter'
import session from 'express-session'
import flash from 'connect-flash'
import methodOverride from 'method-override'
import { errorHandler } from './errorHandler'

const app = express();

//Setting up the app
app.set('view engine', 'ejs')
app.set('layout', './layouts/main')


//Setting up the middlewares
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000 }
}));

app.use(flash());

// Middleware to pass flash messages to all views
app.use((req, res, next) => {
    res.locals.messages = {
        success: req.flash('success'),
        error: req.flash('error')
    }

    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan('tiny'));
app.use(methodOverride('_method'))


// Routes
app.use('/products', userProductsRouter)
app.use('/pages', userPagesRouter);
app.use('/admin/pages', pagesRouter);
app.use('/admin/categories', categoryRouter);
app.use('/admin/products', productsRouter);

// Error Middleware
app.use(errorHandler)



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