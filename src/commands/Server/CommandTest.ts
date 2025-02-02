import Command from "@/commands/Command"

export default class CommandTest extends Command {

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