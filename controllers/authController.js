import { createUserQuery } from "../model/accountQueries.js";
import { body, validationResult } from "express-validator";
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { AppError } from "../utils/AppError.js";
import flash from "express-flash";


dotenv.config()

export async function renderSignupPage(req, res, next) {
    try {
        res.status(200).render("signup")
    } catch (error) {
        next(error)
    }
}

export const validateUser = [
    body("password").isLength({min: 5}).withMessage("Password must be at least 5 characters long"),
    body("confirmPassword").custom((value, {req}) => {
        return value === req.body.password
    }).withMessage("Passwords do not match")
]

export async function createUserController (req, res, next) {
    try {
        const errors = validationResult(req)
        if ( !errors.isEmpty() ) {
            next(new AppError(errors.array()[0].msg, 400))
        }
        const {firstName, lastName, username, password, confirmPassword, admin} = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const isadmin = admin === process.env.ADMIN_KEY
        const ismember = false

        await createUserQuery(firstName,lastName, username, hashedPassword, ismember, isadmin)        
    
        res.status(201).render("homePage")
    } catch (error) {
        if (error.code === "23505") {
            next(new AppError("Username already exists", 409))
        }
        
        return next(error)
    }
}

export async function renderLoginPage(req, res) {
    try {
        res.status(200).render("login", {messages: req.flash("error")})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export async function logoutUser(req, res, next) {
    req.logout((error) => {
        if (error) {
            return next(error)
        }
        
        res.redirect("/")
    })
}

