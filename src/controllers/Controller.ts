import type { Request, Response } from "express"
import type Middleware from "@/middlewares/Middleware"

class Controller {
    constructor(
        protected req: Request,
        protected res: Response,
    ) { }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected async middleware(middleware: Middleware) {
        await middleware.runOutOfContext(this.req, this.res)
    }
}

export default Controller