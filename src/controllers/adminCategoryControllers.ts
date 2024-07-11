import { Request, Response } from "express";
import { validationResult } from "express-validator";
import categoryModel from "../models/categoryModel";



//Showing all Categories in a the DataBase
const showAllCategoroies = async (req: Request, res: Response) => {
    try {
        const allcategories = await categoryModel.find({})
        const messages = req.flash('success')
        res.render('./admin/categories/allCategories', { allcategories, messages })
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal server error")
    }
}


//Open add category form
const addCategory = (req: Request, res: Response) => {
    const errors = req.flash('error')
    res.render('./admin/categories/addCategory', { errors })
}



//Adding new Catgory to the Database
const postNewCategory = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsArr: string[] = errors.array().map(err => err.msg);
        req.flash('error', errorsArr)
        res.render('./admin/categories/addCategory', { errors: errorsArr })
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

        try {
            await category.save()
            req.flash('success', 'Category has been added successfully')
            res.redirect('/admin/categories/allCategories')
        } catch (err) {
            console.log(err)
            res.status(500).send("Internal server error")
        }
    }
}




//Open edit category page
const editCateory = async (req: Request, res: Response) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        const id = req.params.id
        const title = category?.title
        const slug = category?.slug
        res.render('./admin/categories/editCategory', { id, title, slug })
    }
    catch (err) {
        res.status(500).send("Internal server error")
    }
}

//Update the date of the Category in the database
const postEditCategory = async (req: Request, res: Response) => {
    try {

        const { title } = req.body

        let newData = { title }


        await categoryModel.findByIdAndUpdate(req.params.id, newData)
        req.flash('success', 'Category has been updated successfully')
        res.redirect('/admin/categories/allCategories')
    }
    catch (err) {
        res.status(500).send("Internal server error")
    }
}


//Delete Category
const deleteCategory = async (req: Request, res: Response) => {
    try {
        await categoryModel.findByIdAndDelete(req.params.id)
        req.flash('success', 'Category has been deleted successfully')
        res.redirect('/admin/categories/allCategories')
    }
    catch (err) {
        res.status(500).send("Internal server error")
    }
}



export { addCategory, postNewCategory, editCateory, postEditCategory, showAllCategoroies, deleteCategory }