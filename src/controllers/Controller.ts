import type { Request, Response } from "express"
import type Middleware from "@/middlewares/Middleware"

// Contexts
import RequestContext from "@/contexts/RequestContext"

// Types
import type Authenticable from "@/utils/Auth/Authenticable"
import type { DefaultSource } from "@/utils/Auth"
import type Signature from "@/utils/Signature"
import type AppURL from "@/utils/AppURL"

class Controller {
    constructor(
        protected req: Request,
        protected res: Response,
    ) { }

    protected get signature(): Signature | null | undefined {
        return RequestContext.signature
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected static user<T extends Authenticable = DefaultSource>() {
        return RequestContext.Auth?.user<T>()
    }

    protected async middleware(middleware: Middleware): Promise<void> {
        await middleware.runOutOfContext(this.req, this.res)
    }

    protected hasValidSignature(): Promise<Signature | null> {
        return RequestContext.hasValidSignature()
    }

    protected redirect(url: AppURL | string): void {
        return RequestContext.res.redirect(
            typeof url === 'string' ? url : url.href
        )
    }
}

export type ControllerContructor = new (
    req: Request,
    res: Response
) => Controller

export default Controller