import ModuleTemplate, { type ModuleTemplateArgs } from "./ModuleTemplate"

export default class MiddlewareTemplate extends ModuleTemplate {
    public base: string = 'src/middlewares'
    protected path: string
    protected className: string
    protected sufix?: string | undefined
    protected forceOverride?: boolean | undefined

    constructor({ className, path, forceOverride }: ModuleTemplateArgs) {
        super()

        this.path = path ?? ''
        this.className = className
        this.forceOverride = forceOverride
    }

    protected content(): string {
        return `
            import Middleware from "@/middlewares/Middleware"
            import type { Response } from "express"

            export class ${this.className} extends Middleware {
                public async handle(): Promise<void | Response> {
                    return this.res.status(501).json({
                        error: 'Not implemented method'
                    })
                }
            }
        `
    }
}