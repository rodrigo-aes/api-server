import { resolve } from "path"
import { writeFileSync, mkdirSync, existsSync } from "fs"

// Exceptions
import { ModuleAlreadyExistsException } from "@/Exceptions/Templates"

export type ModuleTemplateArgs = {
    className: string
    path?: string
    forceOverride: boolean
}

export default abstract class ModuleTemplate {
    protected abstract base: string
    protected abstract path: string
    protected abstract className: string
    protected abstract sufix?: string
    protected abstract forceOverride?: boolean

    protected moduleType: 'module' | 'package' = 'package'

    public putFile() {
        const path = this.handlePath()
        const dest = resolve(this.base, path)

        this.verifyAlreadyExistsModuleException(dest)

        this.makeDestFolder(path)
        this.createFile(dest)
        this.createTypes(dest)
    }

    // ========================================================================

    private handleFileName() {
        switch (this.moduleType) {
            case "module": return `${this.className}${this.sufix ?? ''}.ts`
            case "package": return 'index.ts'
        }
    }

    // ========================================================================

    private handlePath() {
        switch (this.moduleType) {
            case "module": return this.path
            case "package":
                const handledPath = this.path ? `${this.path}/` : ''
                return `${handledPath}${this.className}`
        }
    }

    // ========================================================================

    private makeDestFolder(path: string) {
        const destFolder = resolve(this.base, path)
        mkdirSync(destFolder, { recursive: true });
    }

    // ========================================================================

    private verifyAlreadyExistsModuleException(dest: string) {
        if (existsSync(`${dest}/${this.handleFileName()}`))
            if (!this.forceOverride) throw new ModuleAlreadyExistsException(
                `${dest}\\${this.className}`
            )
    }

    // ========================================================================

    private createFile(dest: string) {
        const filename = this.handleFileName()
        writeFileSync(`${dest}/${filename}`, Str.dedent(this.content()))
    }

    // ========================================================================

    private createTypes(dest: string) {
        const content = this.types()
        if (content) writeFileSync(`${dest}/types.ts`, Str.dedent(content))
    }

    // ========================================================================

    /**
     * The content string of the main module file
     */
    protected abstract content(): string

    // ========================================================================

    /**
     * The content of the module types in package
     * @returns {string | null} - A string with the content or null
     * @override
     */
    protected types(): string | null {
        return null
    }
}