import ModuleTemplate, { type ModuleTemplateArgs } from "./ModuleTemplate"

type RequestTemplateArgs = ModuleTemplateArgs & {
    controller?: string
    method?: string
}

export default class RequestTemplate extends ModuleTemplate {
    public base: string = 'src/requests'
    protected path: string
    protected className: string
    protected sufix?: string | undefined
    protected forceOverride?: boolean | undefined
    protected moduleType: "module" | "package" = 'module'

    private controller?: string
    private method?: string

    constructor(
        {
            className,
            path,
            forceOverride,
            controller,
            method
        }: RequestTemplateArgs
    ) {
        super()

        this.path = path ?? ''
        this.className = className
        this.forceOverride = forceOverride
        this.controller = controller
        this.method = method
    }

    protected content(): string {
        return `
            import Request, { type Handler } from "../Request"

            ${this.controller
                ? `import ${this.controller} from "@/controllers/${this.controller}"\n`
                : ''
            }
            export default class ${this.className} extends Request {
                protected handlers(): Handler[] {
                    return [
                        ${this.controller && this.method ? `[${this.controller}, '${this.method}']` : ''}
                    ]
                }
            }
        `
    }
}