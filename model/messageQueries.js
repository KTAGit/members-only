import { pool } from "./db.js";

export function createMessageQuery(title, body, userId) {
    return pool.query(`INSERT INTO posts (title, body, user_id) VALUES ($1, $2, $3)`
        , [title, body, userId])
}

export function getMessagesQuery() {
    const messages = pool.query(`SELECT * FROM posts`)
    return messages
}

export function deleteMessagesQuery(id) {
    return pool.query(` DELETE FROM posts
        WHERE id = ($1)
         `, [id])
}