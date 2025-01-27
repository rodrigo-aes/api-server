import Command from "@/commands/Command"

import {
    spawn, 
    type SpawnOptionsWithoutStdio
} from "child_process"

import { resolve } from "path"

type Environment = 'prod' | 'dev'

export default class Serve extends Command {
    private indexPath: string = resolve('index.ts')

    constructor () {
        super()
    }

    // ========================================================================

    protected defineArguments (): void {
        this.argument(
            '[env]',
            'Environment of the application (e.g., development, production)'
        )
    }

    // ========================================================================

    protected defineOptions(): void {
        this.option(
            '--workspaces <value...>',
            'Include workspaces'
        )
    }

    // ========================================================================

    /**
     * 
     * @param {Environment} env - Application environment argument ("prod", "dev") 
     */
    protected handle(env: Environment = 'prod'): void {
        const childProcess = spawn(
            'npx',
            this.handleRunCommand(env),
            this.proccessOptions(env)
        );

        childProcess.stdout.on('data', data => console.log(data.toString()))
        childProcess.stderr.on('data', data => console.log(data.toString()))
    }

    // ========================================================================

    private proccessOptions (env: Environment): SpawnOptionsWithoutStdio {
        return {
            env: {
                ...process.env,
                NODE_ENV: this.handleNodeEnv(env),
                WORKSPACES: this.handleIncludeWorkspaces(),
                FORCE_COLOR: '1',
            },
            shell: true,
            stdio: 'pipe'
        }
    }

    // ========================================================================

    private handleNodeEnv (env: Environment): 'production' | 'development' {
        switch (env.toLowerCase()) {
            default:
            case 'prod': return 'production'
            case 'dev': return 'development'
        }
    }

    // ========================================================================

    private handleRunCommand (env: Environment): string[] {
        switch (env.toLowerCase()) {
            default:
            case 'prod': return ['tsx', this.indexPath]
            case 'dev': return ['nodemon', '--exec', 'tsx', this.indexPath]
        }
    }

    // ========================================================================

    private handleIncludeWorkspaces (): string {
        return (this.opts().workspaces || []).join('|')
    }
}