import ModuleTemplate, { type ModuleTemplateArgs } from "./ModuleTemplate"

type ScheduleTemplateArgs = ModuleTemplateArgs & {
    expression?: string
}

export default class ScheduleTemplate extends ModuleTemplate {
    public base: string = 'src/schedules'
    protected path: string
    protected className: string
    protected sufix?: string | undefined
    protected forceOverride?: boolean | undefined
    protected moduleType: "module" | "package" = 'module'

    private expression?: string

    constructor({
        className,
        path,
        forceOverride,
        expression
    }: ScheduleTemplateArgs) {
        super()

        this.path = path ?? ''
        this.className = className
        this.forceOverride = forceOverride

        this.expression = expression
    }

    protected content(): string {
        return `
            import Schedule, { type ScheduleOptions } from "./Schedule"

            class ${this.className} extends Schedule {
                constructor(
                    public cronExpression: string = '${this.expression ?? '* * * * * *'}',
                    public options: ScheduleOptions = {}
                ) {
                    super(cronExpression, options)
                }

                protected async handle(now: Date | "manual" | "init"): Promise<void> {
                    
                }
            }

            export default new ${this.className}
        `
    }
}