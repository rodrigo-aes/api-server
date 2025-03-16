import ModuleTemplate, { type ModuleTemplateArgs } from "./ModuleTemplate"

type QueueTemplateArgs = ModuleTemplateArgs & {
    connection: string,
    concurrency: number
}

export default class QueueTemplate extends ModuleTemplate {
    public base: string = 'src/queues'
    protected path: string
    protected className: string
    protected sufix?: string | undefined
    protected forceOverride?: boolean | undefined
    protected moduleType: "module" | "package" = 'package'

    private connection: string
    private concurrency: number

    constructor({
        className,
        path,
        forceOverride,
        connection,
        concurrency
    }: QueueTemplateArgs) {
        super()

        this.path = path ?? ''
        this.className = className
        this.forceOverride = forceOverride

        this.connection = connection
        this.concurrency = concurrency
    }

    protected content(): string {
        return `
            import Queue from "@/queues/Queue"
            import { Job } from "bullmq"

            import { ${this.connection} } from "@/database/Redis"

            class ${this.className} extends Queue {
                public async processor(job: Job, token?: string) {

                }
            }

            export default new ${this.className}(
                '${this.className.toLowerCase()}',
                ${this.connection},
                ${this.concurrency}
            )
        `
    }
}