export async function createMessage(req, res, next) {
    try {
        const {title, message} = req.body

    } catch (error) {
        next(error)
    }
}

export function renderCreateMessage(req, res) {
    try {
        res.render("createMessage")
    } catch (error) {
        next(error)
    }
}