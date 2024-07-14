import { Request, Response, NextFunction } from "express";
import pageModel from "../models/pageModel";
import categoryModel from "../models/categoryModel";


//Get home page
const getHome = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const pages = await pageModel.find({})
        const categories = await categoryModel.find({})
        const homePage = await pageModel.findOne({ slug: 'home' })
        const content = homePage?.content
        const title = 'Home'

        res.render('./user/pages', { title, pages, categories, content })
    }
    catch (err) {
        next(err);
    }

}


//Get other pages
const getPage = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const slug = req.params.slug
        const page = await pageModel.findOne({ slug })

        if (!page) {
            req.flash('error', 'Page is not found')
            res.redirect('/users')
        } else {
            const pages = await pageModel.find({})
            const categories = await categoryModel.find({})
            const title = page.title
            const content = page.content

            res.render('./user/pages', { title, pages, categories, content })
        }
    }
    catch (err) {
        next(err);
    }

}


export { getHome, getPage }