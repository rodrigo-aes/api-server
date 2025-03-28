import type { RequestHandler } from "express"

export const NotFound404: RequestHandler = (req, res, next) => {
    return res.status(404).json({
        error: `Endpoint not found in server: ${req.originalUrl}`
    })
}