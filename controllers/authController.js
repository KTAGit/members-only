import { createUserQuery, getUserById, changeMembershipStatus } from "../model/accountQueries.js";
import { body, validationResult } from "express-validator";
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { AppError } from "../utils/AppError.js";
import { getMessagesQuery } from "../model/messageQueries.js";
import flash from "express-flash";


dotenv.config()

export async function renderSignupPage(req, res, next) {
    try {
        res.status(200).render("signup", { messages: req.flash("error") })
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
            return next(new AppError(errors.array()[0].msg, 400))
        }
        const {firstName, lastName, username, password, confirmPassword, admin} = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const isadmin = admin === process.env.ADMIN_KEY
        const ismember = false

        await createUserQuery(firstName,lastName, username, hashedPassword, ismember, isadmin)        
    
        res.status(201).redirect("/login")
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

export async function renderHome(req, res, next){
    try {
        const {rows} = await getMessagesQuery()
        const messagesPromises = rows.map(async(msg) => {
            const user = await getUserById(msg.user_id)
            msg.username = user.username
            msg.date = msg.created_at.toString().slice(0, 10)
            return msg
        })
        const messages = await Promise.all(messagesPromises)

        return res.status(200).render("home", { messages: messages, userData: req.user || null })
    } catch (error) {
        next(error)
    }
}

export async function renderBecomeMember(req, res, next){
    try {
        res.status(200).render("becomeMember", {userId: req.params.id, messages: req.flash("error")})
    } catch (error) {
        next(error)
    }
}

export async function becomeMember(req, res, next){
    try {
        const { userId, memberKey } = req.body
        console.log(userId, memberKey) 
        if (process.env.MEMBERSHIP_KEY !== memberKey) {
            req.flash("error", "Wrong membership key")
            return res.status(401).redirect(`/join-club/${userId}`)
        }

        await changeMembershipStatus(userId)

        res.status(201).redirect("/")
    } catch (error) {
        next(error)
    }
}