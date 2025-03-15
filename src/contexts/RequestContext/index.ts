import { AsyncLocalStorage } from "async_hooks"

import { Request, Response, NextFunction } from "express"
import type { RequestContextMap } from "./types"
import type Auth from "@/utils/Auth"

/**
 * RequestContext instance apply a AsyncLocalStorage context to request async
 * process available in all application locals inside the current request
 */
class RequestContext extends AsyncLocalStorage<RequestContextMap> {
    /**
     * Apply the context with AsyncLocalStorage to request async process
     * 
     * @param {Request} req - Express Request 
     * @param {Response} res - Express Response
     * @param {NextFuction} next - Express Next Function 
     * @returns {void} - `void`
     */
    public apply(req: Request, res: Response, next: NextFunction): void {
        return super.run(this.initMap(req, res, next), next)
    }

    // ------------------------------------------------------------------------

    private initMap(
        req: Request,
        res: Response,
        next: NextFunction
    ): RequestContextMap {
        req.targets = {}
        req.validated = {}

        return {
            req,
            res,
            next,
            Auth: null,
            skip: []
        }
    }

    // Getters ================================================================
    public get req() {
        return this.getStore()!.req
    }

    // ------------------------------------------------------------------------

    public get res() {
        return this.getStore()!.res
    }

    // ------------------------------------------------------------------------

    public get next() {
        return this.getStore()!.next
    }

    // ------------------------------------------------------------------------

    public get skip() {
        return this.getStore()!.skip ?? []
    }

    // ------------------------------------------------------------------------

    public get Auth(): Auth | null | undefined {
        return this.getStore()!.Auth
    }

    // Setters ================================================================
    public set Auth(auth: Auth) {
        this.getStore()!.Auth = auth
    }
}

export default new RequestContext()