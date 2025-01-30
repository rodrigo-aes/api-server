import Command from "@/commands/Command"

export default class CommandTest extends Command {

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