import { Command as CommanderCommand } from "commander"

abstract class Command extends CommanderCommand {
    constructor() {
        super()

        this.defineName()
        this.baseOptions()

        this.defineArguments()
        this.defineOptions()

        this.action(this.handle)
    }

    // ========================================================================

    private defineName() {
        this.name(this.constructor.name.toLowerCase())
    }

    // ========================================================================

    private baseOptions() {
        this.option('-v, --verbose', 'Enable verbose output');
    }

    // ========================================================================

    /**
     * Process initializing log
     * @override
     */
    public initLog(...args: any[]) { }

    // ========================================================================

    /**
     * Process success log
     * @override
     */
    public successLog(...args: any[]) { }

    // ========================================================================

    /**
     * Define command positional arguments
     */
    protected abstract defineArguments(): void

    // ========================================================================

    /**
     * Define command flag options
     */
    protected abstract defineOptions(): void

    // ========================================================================

    /**
     * 
     * @param {string[]} args - The defined arguments in order
     */
    protected abstract handle(...args: (string | undefined)[]): void
}

export default Command