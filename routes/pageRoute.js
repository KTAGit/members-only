import { Router } from "express";
import { createUserController, validateUser, renderSignupPage, renderLoginPage, logoutUser } from "../controllers/authController.js";
import passport from "passport";

export const router = Router()


router.get("/", (req, res) => {
    res.render('home')
})

router.get("/signup", renderSignupPage)

router.post("/signup", validateUser, createUserController)

router.get("/login", renderLoginPage)

router.post("/login", 
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }))

router.post("/logout", logoutUser)