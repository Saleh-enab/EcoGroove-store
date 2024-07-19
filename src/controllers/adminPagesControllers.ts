import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import pageModel from "../models/pageModel";
import { CustomError } from "../errorHandler";



//Showing all pages in a the DataBase
const showAllPages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allPages = await pageModel.find({})
        res.render('./admin/pages/allPages', { allPages })
    }
    catch (err) {
        next(err);
    }
}


//Open add page form
const addPage = (req: Request, res: Response) => {
    const errors = req.flash('error')
    res.render('./admin/pages/addPage', { errors })
}


//Adding new page to the Database
const postNewPage = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req)
    try {
        if (!errors.isEmpty()) {
            const errorsArr: string[] = errors.array().map(err => err.msg);
            const err = new CustomError(errorsArr, 400)
            return next(err)
        } else {
            const title = req.body.title
            let slug = req.body.slug.replace(/\s+/, '_').toLowerCase();
            if (slug === "") {
                slug = title.replace(/\s+/, '_').toLowerCase();
            }
            const content = req.body.content

            const page = new pageModel({
                title: title,
                slug: slug,
                content: content
            })

            await page.save()
            req.flash('success', 'page added successfully')
            res.redirect('/admin/pages')
        }
    } catch (err) {
        next(err);
    }

}


//Open edit page
const editPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = await pageModel.findById(req.params.id)
        const id = req.params.id
        const title = page?.title
        const slug = page?.slug
        const content = page?.content
        res.render('./admin/pages/editPage', { id, title, slug, content })
    }
    catch (err) {
        next(err);
    }
}

//Update the date of the page in database
const postEditPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorsArr: string[] = errors.array().map(err => err.msg);
            const err = new CustomError(errorsArr, 400)
            return next(err)
        } else {
            let newData = {
                title: req.body.title,
                slug: req.body.slug.replace(/\s+/, '_').toLowerCase(),
                content: req.body.content
            }

            if (newData.slug === "") {
                newData.slug = newData.title.replace(/\s+/, '_').toLowerCase();
            }
            await pageModel.findByIdAndUpdate(req.params.id, newData)
            req.flash('success', 'Page has been updated successfully')
            res.redirect('/admin/pages')
        }


    }
    catch (err) {
        next(err)
    }
}

const deletePage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await pageModel.findByIdAndDelete(req.params.id)
        req.flash('success', 'Page has been deleted successfully')
        res.redirect('/admin/pages')
    }
    catch (err) {
        next(err);
    }
}



export { addPage, postNewPage, showAllPages, editPage, postEditPage, deletePage }