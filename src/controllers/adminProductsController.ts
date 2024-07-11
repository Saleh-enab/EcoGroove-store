import productModel from "../models/productModel"
import categoryModel from "../models/categoryModel"
import { Request, Response } from "express"
import { validationResult } from "express-validator"
import fs from 'fs'
import path from "path"
import { ProductArgs } from "../models/productModel"


//Showing all products in a the DataBase
const showAllProducts = async (req: Request, res: Response) => {
    try {
        const allProducts = await productModel.find({})
        const messages = req.flash('success')
        res.render('./admin/products/allProducts', { products: allProducts, messages })
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal server error")
    }
}


//Open add product from
const addProduct = async (req: Request, res: Response) => {
    try {
        const allCategotioes = await categoryModel.find({})
        const errors = req.flash('error')
        res.render('./admin/products/addProduct', { categories: allCategotioes, errors })
    }
    catch (err) {
        res.status(500).send("Internal server error")
    }

}


//Add new product to the database
const postNewProduct = async (req: Request, res: Response) => {

    const allCategotioes = await categoryModel.find({})
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsArr: string[] = errors.array().map(err => err.msg);
        req.flash('error', errorsArr)
        res.render('./admin/products/addProduct', { errors: errorsArr, categories: allCategotioes })
    } else {
        const title: string = req.body.title
        const description: string = req.body.desc
        const category: string = req.body.category
        const price = Number(req.body.price)
        const image = req.file?.filename

        const product = new productModel({
            title,
            desc: description,
            category,
            price,
            image
        })
        try {
            await product.save()
            req.flash('success', "Product has been added successfully")
            res.redirect('/admin/products/allProducts')
        }
        catch (err) {
            res.status(500).send("Internal server error")
        }
    }
}


//Open edit product page
const editProduct = async (req: Request, res: Response) => {
    try {
        const errors = req.flash('error')
        const product = await productModel.findById(req.params.id)
        const categories = await categoryModel.find({})
        res.render('./admin/products/editProduct', { product, categories, errors })
    }
    catch (err) {
        res.status(500).send("Ineternal server error")
    }
}

//Update the date of the product in the database
const postEditProduct = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsArr: string[] = errors.array().map(err => err.msg);
        req.flash('error', errorsArr)
        res.redirect(`/admin/products/edit-product/${req.params.id}`)
    } else {
        try {

            const { title, desc, category, price } = req.body

            let newData: ProductArgs = { title, desc, category, price: Number(price) }



            if (req.file?.filename) {
                try {
                    const product = await productModel.findById(req.params.id)
                    newData.image = req.file.filename
                    fs.unlink(path.join(__dirname, `../../public/images/${product?.image}`), (err) => {
                        console.log(err)
                    })

                } catch (err) {
                    res.status(500).send("Internal server error")
                }
            }

            await productModel.findByIdAndUpdate(req.params.id, newData)
            req.flash('success', 'Product has been updated successfully')
            res.redirect('/admin/products/allProducts')
        }
        catch (err) {
            // console.log(err)
            res.status(500).send("Internal server error")
        }
    }

}

//Delete product
const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (product?.image) {
            fs.unlink(path.join(__dirname, `../../public/images/${product?.image}`), (err) => {
                console.log(err)
            })
        }

        await productModel.findByIdAndDelete(req.params.id)
        req.flash('success', "User has been deleted successfully")
        res.redirect('/admin/products/allProducts')
    }
    catch (err) {
        res.status(500).send('Internal server error')
    }


}

export { showAllProducts, addProduct, postNewProduct, deleteProduct, editProduct, postEditProduct } 
