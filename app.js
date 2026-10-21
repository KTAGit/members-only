import express from 'express'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'url';
import { pool } from './model/db.js';
import { createTable } from './model/schema.js';
import { router } from './routes/pageRoute.js';
import { AppError } from './utils/AppError.js';
import passport from 'passport';
import configurePassport from './config/passport.js';
import session from 'express-session';
import flash from 'express-flash';


configurePassport(passport)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())


app.use("/", router)



app.use((req, res, next) => {
    next(new AppError("Page not found", 404))
})

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    const statusCode = err.statusCode || 500

    switch (statusCode) {
        case 400:
            res.status(400).render("signup", {success: false, message: err.message})
            break;
        case 404:
            res.status(404).render("errors/404")
            break;
        case 409: 
            res.status(409).render("signup", {success: false, message: err.message})
            break;
        default:
            res.status(500).render("errors/500")
            break;
    }
})


const PORT = process.env.PORT

async function startServer() {
    try {
        await pool.query("SELECT 1")
        console.log("Database connected")
        createTable()
        app.listen(PORT, async () => {
            console.log("Listening on PORT", PORT)
        })
        
    } catch (error) {
        console.log("Database faild to connect", error.message)
    }
}

startServer() 