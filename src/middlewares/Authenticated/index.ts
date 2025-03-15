import Middleware from "@/middlewares/Middleware"
import type { Response } from "express"

// Utils
import Auth from "@/utils/Auth"

// Config
import { defaultAcceptedSources } from "@/config/auth"

// Types
import type { AuthSourceKey } from "@/utils/Auth"

export class Authenticated extends Middleware {
    constructor(public accept: AuthSourceKey[] = defaultAcceptedSources) {
        super()
    }

    public async handle(): Promise<void | Response> {
        const authenticable = await Auth.verify()
        if (authenticable) {
            if (this.accept?.includes(Auth.sourceKey)) return this.next()

            return this.res.status(403).json({
                error: this.notAcceptedMessage()
            })
        }

        return this.res.status(401).json({
            error: 'Unauthorized (unauthenticated)'
        })
    }

    // Private Methods ========================================================
    private notAcceptedMessage(): string {
        return `Forbidden! (resource only authorized for ${defaultAcceptedSources.join(', ')})`
    }
}