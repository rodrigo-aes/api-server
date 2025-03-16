import ModuleTemplate, { type ModuleTemplateArgs } from "./ModuleTemplate"

type RedisDatabaseTemplateArgs = ModuleTemplateArgs & {
    db?: number
}

export default class RedisDatabaseTemplate extends ModuleTemplate {
    public base: string = 'src/database/Redis'
    protected path: string
    protected className: string
    protected sufix?: string | undefined
    protected forceOverride?: boolean | undefined
    protected moduleType: "module" | "package" = 'module'

    private db: number

    constructor({
        className,
        path,
        forceOverride,

        db = 0
    }: RedisDatabaseTemplateArgs) {
        super()

        this.path = path ?? ''
        this.className = className
        this.forceOverride = forceOverride

        this.db = db
    }

    protected content(): string {
        return `
            import Redis from "./Redis";

            class ${this.className} extends Redis { }

            export default new ${this.className}(${this.db}, {
                maxRetriesPerRequest: null
            })
        `
    }
}