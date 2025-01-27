import ModuleTemplate from "./ModuleTemplate"

export type CommandTemplateArgs = {
    className: string
    path?: string
}

export default class CommandTemplate extends ModuleTemplate {
    protected base: string = 'src/commands'
    protected path: string
    protected className: string
    protected sufix?: string | undefined

    constructor ({ className, path }: CommandTemplateArgs) {
        super()

        this.path = path ?? ''
        this.className = className
    }

    // ========================================================================

    protected content () {
        return `
            import Command from "@/commands/Command"

            export default class ${this.className} extends Command {
                constructor() {
                    super()
                }

                // ========================================================================

                /**
                 * Define command positional arguments
                 */
                protected defineArguments (): void {}

                // ========================================================================

                /**
                 * Define command flag options
                 */
                protected defineOptions(): void {}

                // ========================================================================

                protected handle(): void {
                    // Command action handle...
                }
            }
        `
    }
}