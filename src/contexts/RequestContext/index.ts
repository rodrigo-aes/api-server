import { AsyncLocalStorage } from "async_hooks"

import { Request, NextFunction } from "express"
import type { RequestContextMap } from "./types"

class RequestContext extends AsyncLocalStorage<RequestContextMap> {
    public apply(req: Request, next: NextFunction) {
        return super.run({ req }, next)
    }

    // ------------------------------------------------------------------------

    public get req() {
        return this.getStore()?.req
    }
}

export default new RequestContext()