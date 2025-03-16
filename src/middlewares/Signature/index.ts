import Middleware from "@/middlewares/Middleware"
import type { Response } from "express"

import RequestContext from "@/contexts/RequestContext"

type SignatureMap = {
    expireCaseStatus?: number | number[]
}
export class Signature extends Middleware {
    private expireCaseStatus?: number | number[]

    constructor(initMap?: SignatureMap) {
        super()

        this.expireCaseStatus = initMap?.expireCaseStatus
    }

    public async handle(): Promise<void | Response> {
        const signature = await AppURL.hasValidSignature()

        if (signature) {
            if (this.expireCaseStatus) signature.expireCaseStatus(
                this.expireCaseStatus
            )

            RequestContext.signature = signature
            return this.next()
        }

        return this.res.status(403).json({
            error: 'Forbidden (missing or invalid signature)'
        })
    }
}