import { AsyncLocalStorage } from "async_hooks"

import { Request, NextFunction } from "express"
import type { RequestContextMap } from "./types"
import type Auth from "@/utils/Auth"

class RequestContext extends AsyncLocalStorage<RequestContextMap> {
    public apply(req: Request, next: NextFunction) {
        return super.run(this.initMap(req), next)
    }

    // ------------------------------------------------------------------------

    private initMap(req: Request): RequestContextMap {
        return {
            req,
            Auth: null,
            skip: []
        }
    }

    // Getters ================================================================
    public get req() {
        return this.getStore()?.req
    }

    // ------------------------------------------------------------------------

    public get skip() {
        return this.getStore()?.skip ?? []
    }

    // ------------------------------------------------------------------------

    public get Auth(): Auth | null | undefined {
        return this.getStore()?.Auth
    }

    // Setters ================================================================
    public set Auth(auth: Auth) {
        this.getStore()!.Auth = auth
    }
}

export default new RequestContext()