import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import categoryModel from "../models/categoryModel";
import { CustomError } from "../errorHandler";



//Showing all Categories in a the DataBase/fix Cannot find name 'next'.
const showAllCategoroies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allcategories = await categoryModel.find({})
        res.render('./admin/categories/allCategories', { allcategories })
    }
    catch (err) {
        next(err);
    }
}


//Open add category form
const addCategory = (req: Request, res: Response) => {
    const errors = req.flash('error')
    res.render('./admin/categories/addCategory', { errors })
}



//Adding new Catgory to the Database
const postNewCategory = async (req: Request, res: Response, next: NextFunction) => {
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

            const category = new categoryModel({
                title: title,
                slug: slug,
            })
            await category.save()
            req.flash('success', 'Category has been added successfully')
            res.redirect('/admin/categories/allCategories')
        }

    } catch (err) {
        next(err);
    }
}


//Open edit category page
const editCateory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        const id = req.params.id
        const title = category?.title
        const slug = category?.slug
        res.render('./admin/categories/editCategory', { id, title, slug })
    }
    catch (err) {
        next(err);
    }
}


//Update the date of the Category in the database
const postEditCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorsArr: string[] = errors.array().map(err => err.msg);
            const err = new CustomError(errorsArr, 400)
            return next(err)
        } else {
            const { title } = req.body
            let newData = { title }
            await categoryModel.findByIdAndUpdate(req.params.id, newData)
            req.flash('success', 'Category has been updated successfully')
            res.redirect('/admin/categories/allCategories')
        }


    }
    catch (err) {
        next(err);
    }
}


//Delete Category
const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await categoryModel.findByIdAndDelete(req.params.id)
        req.flash('success', 'Category has been deleted successfully')
        res.redirect('/admin/categories/allCategories')
    }
    catch (err) {
        next(err);
    }
}



export { addCategory, postNewCategory, editCateory, postEditCategory, showAllCategoroies, deleteCategory }