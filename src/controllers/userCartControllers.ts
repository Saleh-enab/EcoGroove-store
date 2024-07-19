import { Request, Response, NextFunction } from "express";
import productModel from "../models/productModel";
import categoryModel from "../models/categoryModel";
import pageModel from "../models/pageModel";
import { CustomError } from "../errorHandler";

declare module 'express-session' {
    interface SessionData {
        cart?: { id: string, title: string, quantity: number, price: number, image: string }[];
    }
}


const getPagesAndCategories = async () => {
    const categories = await categoryModel.find({});
    const pages = await pageModel.find({});
    return { pages, categories };
};


//GET add product to cart

const addToCart = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = req.params.id;

        const product = await productModel.findById(id)

        if (typeof req.session.cart === "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                id: product?.id,
                title: product?.title!,
                quantity: 1,
                price: parseFloat(product?.price.toFixed(2)!),
                image: '/images/' + product?.id + '/' + product?.image
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].id == id) {
                    cart[i].quantity++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    id: product?.id,
                    title: product?.title!,
                    quantity: 1,
                    price: parseFloat(product?.price.toFixed(2)!),
                    image: '/images/' + product?.id + '/' + product?.image
                });
            }
        }
        req.flash('success', 'Product added!');
        res.redirect('back');
    }
    catch (err) {
        next(err);
    }
};


//GET checkout page
const checkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.session.cart && req.session.cart.length == 0) {
            delete req.session.cart
            res.redirect('/cart/checkout')
        } else {
            const cart = req.session.cart
            const title = "Checkout"
            const { pages, categories } = await getPagesAndCategories()
            res.render('./user/checkout', { title, cart, pages, categories })
        }

    }
    catch (err) {
        next(err);
    }
}


const updateCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = req.session.cart!
        const id = req.params.id
        const action = req.query.action
        for (let i = 0; i < cart?.length; i++) {
            if (cart[i].id === id) {
                switch (action) {
                    case "add":
                        cart[i].quantity++;
                        break;
                    case "remove":
                        cart[i].quantity--;
                        if (cart.length === 0) {
                            delete req.session.cart
                        }
                        break;
                    case "clear":
                        cart.splice(i, 1)
                        if (cart.length === 0) {
                            delete req.session.cart
                        }
                        break;
                    default:
                        return (new CustomError("Error while updating the cart", 500))
                }
                break;
            }
        }

        req.flash("success", "Cart updated successfully");
        res.redirect('/cart/checkout');

    }
    catch (err) {
        next(err);
    }
}

const clearCart = (req: Request, res: Response, next: NextFunction) => {
    delete req.session.cart
    res.redirect('/cart/checkout')
}

const buyNow = (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200);
}

export { addToCart, checkout, updateCart, clearCart, buyNow }