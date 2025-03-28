import type { ErrorRequestHandler } from "express"
import { MulterError } from "multer"

export const InternalServerError500: ErrorRequestHandler = (
    error, req, res, next
) => {
    if (error instanceof MulterError) return res.status(500).json({
        errors: {
            [error.field ?? 'file']: [error.message]
        }
    })

    return res.status(500).json({
        error: error.message
    })
}