import { createMessageQuery, getMessagesQuery, deleteMessagesQuery } from "../model/messageQueries.js"

export async function createMessage(req, res, next) {
    try {
        const {title, message, userId} = req.body

        await createMessageQuery(title, message, userId)

        res.status(201).redirect("/")

    } catch (error) {
        next(error)
    }
}

export async function renderCreateMessage(req, res, next) {
    try {
        res.render("createMessage", {userId: req.params.id})
    } catch (error) {
        next(error)
    }
}

export async function deleteMessageController(req, res, next) {
    try {

        await deleteMessagesQuery(req.params.id)

        res.status(201).redirect("/")
    } catch (error) {
        next(error)
    }
}