import Middleware from "@/middlewares/Middleware"
import type { Response } from "express"

import RequestContext from "@/contexts/RequestContext"

export class Signature extends Middleware {
    public async handle(): Promise<void | Response> {
        const signature = await AppURL.hasValidSignature()

        if (signature) {
            RequestContext.signature = signature
            return this.next()
        }

        return this.res.status(403).json({
            error: 'Forbidden (missing or invalid signature)'
        })
    }
}