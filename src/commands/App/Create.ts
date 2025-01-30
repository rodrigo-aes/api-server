import Command from "@/commands/Command";
import Log from "@/utils/Log";

// Templates
import { CommandTemplate } from '@/templates'

// Decorators
import { ProccessLog } from "@/commands/Decorators";

type ModuleType = (
    'command'
)

export default class Create extends Command {
    private fullname!: string
    private className!: string
    private path?: string

    // ========================================================================

    protected defineArguments(): void {
        this.argument('<type>')
        this.argument('<name>')
    }

    // ========================================================================

    protected defineOptions(): void { }

    // ========================================================================

    @ProccessLog
    protected handle(type: ModuleType, name: string): void {
        this.fullname = name
        this.handleModuleName()

        switch (type) {
            case 'command': this.createNewCommand()
                break
        }
    }

    // ========================================================================

    protected initLog(type: ModuleType, name: string) {
        Log.out('');
        Log.out(`Creating #[warning]${type} #[info]${name}...`)
    }

    // ========================================================================

    protected successLog(type: ModuleType, name: string) {
        Log.out(`${type} ${name} #[success]created successfuly`)
    }

    // ========================================================================

    private handleModuleName(): void {
        const path = this.fullname.split('/')

        this.className = path.pop() as string
        this.path = path.join('/')
    }

    // ========================================================================

    private createNewCommand() {
        new CommandTemplate({
            className: this.className,
            path: this.path
        })
            .putFile()
    }
}