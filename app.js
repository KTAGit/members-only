import express from 'express'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'url';
import { pool } from './model/db.js';
import { createTable } from './model/schema.js';

import ejs from 'ejs'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')




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