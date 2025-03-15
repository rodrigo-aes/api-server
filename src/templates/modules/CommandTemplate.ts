import ModuleTemplate, { type ModuleTemplateArgs } from "./ModuleTemplate"

export default class CommandTemplate extends ModuleTemplate {
    public base: string = 'src/commands'
    protected path: string
    protected className: string
    protected sufix?: string | undefined
    protected forceOverride?: boolean | undefined
    protected moduleType: "module" | "package" = 'module'

    constructor({ className, path, forceOverride }: ModuleTemplateArgs) {
        super()

        this.path = path ?? ''
        this.className = className
        this.forceOverride = forceOverride
    }

    // ========================================================================

    protected content() {
        return `
            import Command from "@/commands/Command"

            export default class ${this.className} extends Command {

                /**
                 * Process initializing log
                 */
                public initLog() { }

                // ========================================================================

                /**
                 * Process success log
                 */
                public successLog() { }

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