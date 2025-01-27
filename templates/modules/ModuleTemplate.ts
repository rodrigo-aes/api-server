import { resolve } from "path"
import { writeFileSync, mkdirSync,  } from "fs"

export default abstract class ModuleTemplate {
    protected abstract base: string
    protected abstract path: string
    protected abstract className: string
    protected abstract sufix?: string

    public putFile () {
        const dest = resolve(
            this.base,
            this.path,
            this.className,
            this.sufix ?? ''
        )

        const destFolder = resolve(this.base, this.path)
        
        mkdirSync(destFolder, { recursive: true });
        writeFileSync(`${dest}.ts`, this.dedent())
    }

    // ========================================================================

    private dedent(): string {
        const lines = this.content().split("\n");
        const indentLength = Math.min(
            ...lines.filter(line => line.trim().length > 0)
                .map(line => line.match(/^\s*/)?.[0]?.length || 0)
        );
        return lines.map(line => line.slice(indentLength)).join("\n").trim();
    }

    // ========================================================================

    protected abstract content (): string  
}