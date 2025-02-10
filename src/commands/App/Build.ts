import Command from "@/commands/Command"
import { spawn } from "child_process"
import { resolve, join } from "path"
import { readFileSync, writeFileSync, copyFileSync, cpSync } from "fs"

export default class Build extends Command {
    private outDir!: string
    private packageJson!: any
    private workspaces!: string[]

    // ========================================================================

    protected defineArguments(): void { }

    // ========================================================================

    protected defineOptions(): void {
        this.option(
            '--workspaces <value...>',
            'Include workspaces'
        )

        this.option(
            '--outDir <value>',
            'Define out file path'
        )
    }

    // ========================================================================

    protected handle(): void {
        this.defineOutDir()
        this.handleBuild()
        // this.handlePackageJson()
        this.handleWorkspaces()
        this.copyCerts()

    }

    // ========================================================================

    private defineOutDir() {
        const outDir = this.opts().outDir
        this.outDir = outDir ?? 'dist'
    }

    // ========================================================================

    private handleBuild() {
        Log.out('#[warning] Generating application production build...')

        const esbuild = spawn(
            'npx',
            [
                'esbuild',
                'index.ts',
                '--bundle',
                `--outfile=${this.outDir}/index.js`,
                '--format=cjs',
                '--platform=node'
            ],
            {
                env: {
                    ...process.env,
                },
                shell: true,
            }
        );

        esbuild.stdout.on('data', (data) => console.log(data.toString()));
        esbuild.stderr.on('data', (data) => console.log(data.toString()));

        esbuild.on('close', (code) => {
            if (code === 0) Log.out(
                '#[success] Application build proccess success!'
            )
            else Log.out(
                `#[danger] Appliction build ERROR: #[default]status: ${code}`
            )
        });
    }

    // ========================================================================

    private handlePackageJson() {
        Log.out('#[info]Coping package.json to destination...')

        this.loadPackageJson()
        this.alterPackageJson()
        this.savePackageJson()

        Log.out('#[success]package.json copied')
    }

    // ========================================================================

    private loadPackageJson() {
        const path = resolve('package.json')
        this.packageJson = JSON.parse(readFileSync(path, 'utf8'))
    }

    // ========================================================================

    private alterPackageJson() {
        this.packageJson.type = 'commonjs'
    }

    // ========================================================================

    private savePackageJson() {
        const dest = join(this.outDir, 'package.json');
        writeFileSync(dest, JSON.stringify(this.packageJson, null, 2))
    }

    // ========================================================================

    private handleWorkspaces() {
        this.workspaces = [
            'production',
            ...(this.opts().workspaces ?? [])
        ]

        this.handleEnvironmentFiles()
    }

    // ========================================================================

    private handleEnvironmentFiles() {
        this.copyEnvifile()
        this.workspaces.forEach(workspace => this.copyEnvifile(workspace))
    }

    // ========================================================================

    private copyEnvifile(workspace?: string) {
        const filename = `.env${workspace ? `.${workspace}` : ''}`

        const origin = resolve(filename)
        const dest = join(this.outDir, filename)

        copyFileSync(origin, dest)
    }

    // ========================================================================

    private copyCerts() {
        const origin = resolve('certs')
        const dest = join(this.outDir, 'certs')

        cpSync(origin, dest, {
            recursive: true
        })
    }
}