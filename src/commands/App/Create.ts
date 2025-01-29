import Command from "@/commands/Command";

// Templates
import { CommandTemplate } from '@/templates'

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

    protected handle(type: ModuleType, name: string): void {
        this.fullname = name
        this.handleModuleName()

        switch (type) {
            case 'command': this.createNewCommand()
                break
        }
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