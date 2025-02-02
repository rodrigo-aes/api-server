import Command from "@/commands/Command";
import Log from "@/utils/Log";

import { resolve } from "path";
import { existsSync } from "fs";

// Templates
import {
    CommandTemplate,
    ModelTemplate
} from '@/templates'

// Decorators
import { ProccessLog } from "@/commands/Decorators";

type ModuleType = (
    'command' |
    'model'
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

    protected defineOptions(): void {
        this.option(
            '--force-override',
            'Force override of existente module.',
            false
        )
    }

    // ========================================================================

    @ProccessLog
    protected handle(type: ModuleType, name: string): void {
        this.fullname = name
        this.handleModuleName()

        switch (type) {
            case 'command': this.createNewCommand()
                break

            case "model": this.createNewModel()
                break
        }
    }

    // ========================================================================

    public initLog(type: ModuleType, name: string) {
        Log.out('');
        Log.out(`Creating #[warning]${type} #[info]${name}...`)
    }

    // ========================================================================

    public successLog(type: ModuleType, name: string) {
        Log.out(`${type} ${name} #[success]created successfuly`)
    }

    // ========================================================================

    private handleModuleName(): void {
        const path = this.fullname.split('/')

        this.className = path.pop() as string
        this.path = path.join('/')
    }

    // =======================================================================

    private createNewCommand() {
        new CommandTemplate({
            className: this.className,
            path: this.path,
            forceOverride: this.opts().forceOverride
        }).putFile()
    }

    // =======================================================================

    private createNewModel() {
        new ModelTemplate({
            className: this.className,
            path: this.path,
            forceOverride: this.opts().forceOverride
        }).putFile()
    }
}