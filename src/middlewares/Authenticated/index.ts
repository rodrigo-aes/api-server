import Middleware from "@/middlewares/Middleware"
import type { Response } from "express"

// Utils
import Auth from "@/utils/Auth"

// Types
import type { AuthSourceKey } from "@/utils/Auth"

export class Authenticated extends Middleware {
    constructor(public source?: AuthSourceKey) {
        super()
    }

    public async handle(): Promise<void | Response> {
        const authenticable = await Auth.source(this.source).verify()
        if (authenticable) return this.next()

        return this.res.status(401).json({
            error: 'Unauthorized (unauthenticated)'
        })
    }
}