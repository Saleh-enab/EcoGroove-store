import express, { NextFunction, Request, Response } from 'express'
import * as path from 'path'
import morgan from 'morgan'
import * as config from './config'
import mongoose from 'mongoose'
import userPagesRouter from './routes/userPagesRouter'
import userProductsRouter from './routes/userProductsRoutes'
import userCartRouter from './routes/userCartRouter'
import pagesRouter from './routes/adminPagesRoutes'
import categoryRouter from './routes/adminCategoryRoutes'
import productsRouter from './routes/adminProductRouter'
import usersRouter from './routes/usersRouter'
import session from 'express-session'
import flash from 'connect-flash'
import methodOverride from 'method-override'
import { errorHandler } from './errorHandler'
import MongoStore from 'connect-mongo'


const app = express();


const store = MongoStore.create({ mongoUrl: config.dbURI, collectionName: "sessions" })

//Setting up the app
app.set('view engine', 'ejs')
app.set('layout', './layouts/main')


//Setting up the middlewares
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: store
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



//Locals setup
app.get('*', (req: Request, res: Response, next: NextFunction) => {
    res.locals.cart = req.session.cart;
    res.locals.user = req.session.user || null;

    next();
})


// Routes
app.use('/users', usersRouter)
app.use('/cart', userCartRouter)
app.use('/products', userProductsRouter)
app.use('/pages', userPagesRouter);
app.use('/admin/pages', pagesRouter);
app.use('/admin/categories', categoryRouter);
app.use('/admin/products', productsRouter);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    if (!(req.url == '/favicon.ico')) {
        req.flash('error', "Invalid URL");
        res.redirect('/products')
    }
})

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