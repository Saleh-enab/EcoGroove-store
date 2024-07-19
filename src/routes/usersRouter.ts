import * as controller from '../controllers/usersController'
import express from 'express'
import { check } from 'express-validator'

const router = express.Router();

router.get('/register', controller.openRegisterForm)

router.post('/register', [
    check("name")
        .notEmpty()
        .escape()
        .withMessage("Name must have a value"),
    check("email")
        .notEmpty()
        .withMessage("Email must have a value")
        .isEmail()
        .withMessage("Invalid Email value"),
    check("username")
        .notEmpty()
        .escape()
        .withMessage("Username must have a value"),
    check("password")
        .notEmpty()
        .withMessage("Password must have a value")
        .isStrongPassword()
        .withMessage("Weak password, minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"),
    check("password2")
        .custom((value, { req }) => { return value === req.body.password })
        .withMessage("Passwords do not match")
], controller.addNewUser)

router.get('/login', controller.openLoginForm)

router.post('/login', [
    check("email")
        .notEmpty()
        .withMessage("Email must have a value")
        .isEmail()
        .withMessage("Invalid Email value"),
    check("password")
        .notEmpty()
        .withMessage("Password must have a value")
], controller.login)


router.get('/logout', controller.logout)


export = router