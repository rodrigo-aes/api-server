import Command from "@/commands/Command"
import { DatabaseMigration } from "@/database/MySQL"

export default class Migrate extends Command {

    /**
     * Process initializing log
     */
    public initLog() {
        Log.out('#[warning]Initializing database migration process...')
    }

    // ========================================================================

    /**
     * Process success log
     */
    public successLog() {
        Log.out('#[success]Database migration proccess executed successfully')
    }

    // ========================================================================

    /**
     * Define command positional arguments
     */
    protected defineArguments(): void { }

    // ========================================================================

    /**
     * Define command flag options
     */
    protected defineOptions(): void {
        this.option('--force', 'Set to force reset database')
        this.option('--alter', 'Set to alter database')
    }

    // ========================================================================

    protected async handle(): Promise<void> {
        const options = this.opts()
        await new DatabaseMigration(options).execute()
    }
}