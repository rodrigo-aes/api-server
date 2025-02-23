import { Request, Response, NextFunction } from "express";

// Contexts
import RequestContext from "@/contexts/RequestContext";

// Exceptions
import { HttpResponseException } from "@/Exceptions/Request";

export default abstract class Middleware {
    protected req!: Request
    protected res!: Response
    protected next!: NextFunction

    public async run(req: Request, res: Response, next: NextFunction) {
        this.req = req
        this.res = res
        this.next = next

        if (this.shouldSkip()) return this.next()

        return this.handle()
    }

    // ========================================================================

    public async runOutOfContext(req: Request, res: Response): Promise<true> {
        this.req = req
        this.res = res
        this.next = () => undefined

        const response = await this.handle()
        if (response) throw new HttpResponseException(response)

        return true
    }

    // ========================================================================

    private shouldSkip() {
        return RequestContext.skip.includes(
            this.constructor.name.toLowerCase()
        )
    }

    // ========================================================================

    public abstract handle(): Promise<void | Response>
}