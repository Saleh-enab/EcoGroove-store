import { Request, Response, NextFunction } from "express";
import categoryModel from "../models/categoryModel";
import pageModel from "../models/pageModel";
import { CustomError } from "../errorHandler";
import { validationResult } from "express-validator";
import userModel from "../models/userModel";
import { IUser } from "../models/userModel";
import bcrypt from 'bcrypt'



declare module 'express-session' {
    interface SessionData {
        user?: IUser;
    }
}





const getPagesAndCategories = async () => {
    const categories = await categoryModel.find({});
    const pages = await pageModel.find({});
    return { pages, categories };
};


const openRegisterForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const title = "Register";
        const { pages, categories } = await getPagesAndCategories();
        res.render('./user/register', { title, categories, pages })
    }
    catch (err) {
        next(err);
    }

}


const addNewUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorsArr: string[] = errors.array().map(err => err.msg);
            throw new CustomError(errorsArr, 400)
        } else {
            const { name, email, username, password } = req.body
            const oldUser = await userModel.findOne({ username: username })
            if (oldUser) {
                req.flash("error", "Username exists already,choose another one");
                res.redirect('/users/register');
            } else {
                let admin = false
                const hashedPassword = await bcrypt.hash(password, 10)
                if (email === "salehenab850@gmail.com") {
                    admin = true
                }
                const user = new userModel({
                    name,
                    email,
                    username,
                    password: hashedPassword,
                    admin
                })
                await user.save();
                req.flash('success', "User has been added successfully")
                res.redirect('/users/login')
            }
        }
    }
    catch (err) {
        next(err);
    }
}


const openLoginForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const title = "Login";
        const { pages, categories } = await getPagesAndCategories();
        res.render('./user/login', { title, categories, pages })
    }
    catch (err) {
        next(err);
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorsArr: string[] = errors.array().map(err => err.msg);
            throw new CustomError(errorsArr, 400)
        } else {
            const { email, password } = req.body
            const user = await userModel.findOne({ email })
            let isMatch = false
            if (user) {
                isMatch = await bcrypt.compare(password, user.password)
            }
            if (user && isMatch) {
                req.session.user = user
                req.flash('success', "Logged-in successfully")
                res.redirect('/products')
            } else {
                req.flash('error', "Invalid Email or Password, Please try again")
                res.redirect('/users/login')
            }
        }

    }
    catch (err) {
        next(err);
    }
}

const logout = (req: Request, res: Response, next: NextFunction) => {
    delete req.session.cart
    delete req.session.user
    req.flash('success', "User logged-out successfully")
    res.redirect('/users/login')
}

export { openRegisterForm, addNewUser, openLoginForm, login, logout }