import { AsyncLocalStorage } from "async_hooks"

import { Request, NextFunction } from "express"
import type { RequestContextMap } from "./types"

class RequestContext extends AsyncLocalStorage<RequestContextMap> {
    public apply(req: Request, next: NextFunction) {
        return super.run(this.initMap(req), next)
    }

    // ------------------------------------------------------------------------

    private initMap(req: Request): RequestContextMap {
        return {
            req,
            skip: []
        }
    }

    // ------------------------------------------------------------------------

    public get req() {
        return this.getStore()?.req
    }

    // ------------------------------------------------------------------------

    public get skip() {
        return this.getStore()?.skip ?? []
    }
}

export default new RequestContext()