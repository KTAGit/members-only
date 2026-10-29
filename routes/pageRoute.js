import { Router } from "express";
import { createUserController, validateUser, renderSignupPage, renderLoginPage, logoutUser, renderHome, renderBecomeMember, becomeMember } from "../controllers/authController.js";
import { createMessage, renderCreateMessage, deleteMessageController } from "../controllers/messageController.js";
import passport from "passport";

export const router = Router()


router.get("/", renderHome)

router.get("/signup", renderSignupPage)

router.post("/signup", validateUser, createUserController)

router.get("/login", renderLoginPage)

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
       if (err) return next(err)

        if (!user) {
            req.flash("error", info?.message || "Login failed. Please try again.")
            return res.status(401).redirect("/login")
        }

        req.login(user, (err) => {
            if (err) return next(err)

            return res.status(200).redirect("/")
        })
    })(req, res, next)
})

router.get("/create-message/:id", renderCreateMessage)

router.post("/create-message", createMessage)

router.get("/delete-message/:id", deleteMessageController)

router.get("/join-club/:id", renderBecomeMember)

router.post("/join-club", becomeMember)

router.post("/logout", logoutUser)