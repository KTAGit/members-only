import { Strategy as LocalStrategy } from "passport-local"
import { getUserById, getUserByUsername } from "../model/accountQueries.js"
import bcrypt from "bcryptjs"
import passport from "passport"


export default function configurePassport(passport) {
    passport.use(new LocalStrategy(
       async (username, password, done) => {
            try {
                const user = await getUserByUsername(username)

                if (!user) {
                    return done(null, false, { message: "Invalid username" })
                }

                const isMatch = await bcrypt.compare(password, user.hashed_password)

                if (!isMatch) {
                    return done(null, false, {message: "Invalid username or password"})
                }

                return done(null, user)

            } catch (error) {
                return done(error)
            }
        }
    ))
}


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id)

        if (!user) {
            return done(null, false)
        }

        const { hashed_password, ...safeUser } = user

        return done(null, safeUser)
    } catch (error) {
        return done(error)
    }
})