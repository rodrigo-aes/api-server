import Command from "@/commands/Command";
import Log from "@/utils/Log";

// Templates
import {
    CommandTemplate,
    ModelTemplate,
    ControllerTemplate,
    RequestTemplate,
    MiddlewareTemplate,
} from '@/templates'

// Decorators
import { ProccessLog } from "@/commands/Decorators";

type ModuleType = (
    'command' |
    'model' |
    'controller' |
    'request' |
    'middleware'
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

        this.option(
            '--api',
            'Create a controller with API template',
            false
        )

        this.option(
            '--controller <value>',
            'Include target controller to request',
        )

        this.option(
            '--method <value>',
            'Include method name to request'
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

            case 'controller': this.createNewController()
                break

            case 'request': this.createNewRequest()
                break

            case 'middleware': this.createNewMiddleware()
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

    // ========================================================================

    private createNewCommand() {
        new CommandTemplate({
            className: this.className,
            path: this.path,
            forceOverride: this.opts().forceOverride
        }).putFile()
    }

    // ========================================================================

    private createNewModel() {
        new ModelTemplate({
            className: this.className,
            path: this.path,
            forceOverride: this.opts().forceOverride
        }).putFile()
    }

    // ========================================================================

    private createNewController() {
        new ControllerTemplate({
            className: this.className,
            path: this.path,
            forceOverride: this.opts().forceOverride,
            api: this.opts().api
        }).putFile()
    }

    // ========================================================================

    private createNewRequest() {
        new RequestTemplate({
            className: this.className,
            path: this.path,
            forceOverride: this.opts().forceOverride,
            controller: this.opts().controller,
            method: this.opts().method
        }).putFile()
    }

    // ========================================================================

    private createNewMiddleware() {
        new MiddlewareTemplate({
            className: this.className,
            path: this.path,
            forceOverride: this.opts().forceOverride,
        }).putFile()
    }
}