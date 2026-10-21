import { pool } from "./db.js";

export async function createUserQuery(firstName,lastName, username, hashedPassword, ismember, isadmin) {
    const {rows} = await pool.query(
        `INSERT INTO users (first_name, last_name, username, hashed_password, ismember, isadmin)
        VALUES ($1, $2, $3, $4, $5, $6)
        `, [firstName, lastName, username, hashedPassword, ismember, isadmin])

    return rows
}

export async function getUserByUsername(username) {
    const {rows} = await pool.query(
        `SELECT * FROM users
        WHERE username = $1
        `, [username])
    
    return rows[0]
}

export async function getUserById(id) {
    const {rows} = await pool.query(
        `SELECT * FROM users
        WHERE id = $1
        `, [id])
    
    return rows[0]
}