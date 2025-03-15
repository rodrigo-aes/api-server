import ModuleTemplate, { type ModuleTemplateArgs } from "./ModuleTemplate"

type ControllerTemplateArgs = ModuleTemplateArgs & {
    api?: boolean
}

export default class ControllerTemplate extends ModuleTemplate {
    public base: string = 'src/controllers'
    protected path: string
    protected className: string
    protected sufix?: string | undefined
    protected forceOverride?: boolean | undefined

    private api?: boolean

    constructor(
        {
            className,
            path,
            forceOverride,
            api
        }: ControllerTemplateArgs
    ) {
        super()

        this.path = path ?? ''
        this.className = className
        this.forceOverride = forceOverride
        this.api = api
    }

    protected content(): string {
        return `
            import type { Request, Response } from "express"
            import type { ${this.className}Interface } from "./${this.className}.interface"
            import Controller from "@/controllers/Controller"

            export default
                class ${this.className}
                extends Controller
                implements ${this.className}Interface {
                        ${this.api ? this.apiContent() : ''}
                }
        `
    }

    // ------------------------------------------------------------------------

    protected interface(): string | null {
        return `
            import type { Request, Response } from 'express'
            import type Controller from "@/controllers/Controller"

            export interface ${this.className}Interface extends Controller {
                ${this.api ? this.apiInterfaceContent() : ''}
            }
        `
    }

    // Privates ---------------------------------------------------------------
    private apiContent(): string {
        return `
                // Instance Methods =======================================================
                // Publics ----------------------------------------------------------------
                public async list(req: Request, res: Response) {
                    return res.status(501).json({
                        error: 'Method not implemented'
                    })
                }

                // ------------------------------------------------------------------------

                public async get(req: Request, res: Response) {
                    return res.status(501).json({
                        error: 'Method not implemented'
                    })
                }

                // ------------------------------------------------------------------------

                public async create(req: Request, res: Response) {
                    return res.status(501).json({
                        error: 'Method not implemented'
                    })
                }

                // ------------------------------------------------------------------------

                public async update(req: Request, res: Response) {
                    return res.status(501).json({
                        error: 'Method not implemented'
                    })
                }

                // ------------------------------------------------------------------------

                public async delete(req: Request, res: Response) {
                    return res.status(501).json({
                        error: 'Method not implemented'
                    })
                }
        `
    }

    // ------------------------------------------------------------------------

    private apiInterfaceContent(): string {
        return `
                /**
                 * List all source objects
                 * 
                 * @param req - Express Request
                 * @param res - Express Response
                 */
                list(req: Request, res: Response): Promise<Response>

                /**
                 * Get one source object
                 * 
                 * @param req - Express Request
                 * @param res - Express Response
                 */
                get(req: Request, res: Response): Promise<Response>

                /**
                 * Create a source object
                 * 
                 * @param req - Express Request
                 * @param res - Express Response
                 */
                create(req: Request, res: Response): Promise<Response>

                /**
                 * Update source object
                 * 
                 * @param req - Express Request
                 * @param res - Express Response
                 */
                update(req: Request, res: Response): Promise<Response>

                /**
                 * Delete source object/s
                 * 
                 * @param req - Express Request
                 * @param res - Express Response
                 */
                delete(req: Request, res: Response): Promise<Response>
        `
    }
}