import { pool } from "./db.js";

export async function createTable() {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            ismember BOOLEAN NOT NULL DEFAULT false,
            isadmin BOOLEAN NOT NULL DEFAULT false
        )`
    )

    await pool.query(
        `CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            user_id INTEGER REFERENCES users(id),
            created_at TIMESTAMPTZ DEFAULT NOW()
        )`
    )
}