import ModuleTemplate from "./ModuleTemplate"
import type { ModuleTemplateArgs } from "./ModuleTemplate"

export default class ModelTemplate extends ModuleTemplate {
    public base: string = 'src/models'
    protected path: string
    protected className: string
    protected sufix?: string | undefined
    protected forceOverride?: boolean | undefined

    constructor({ className, path, forceOverride }: ModuleTemplateArgs) {
        super()

        this.path = path ?? ''
        this.className = className
        this.forceOverride = forceOverride
    }

    protected content(): string {
        return `
            import Model, { StaticSelf } from "@/models/Model"
            import {
                Table,
            } from "sequelize-typescript"

            // Types
            import type { ${this.className}Attributes, ${this.className}CreationAttributes } from "./types"

            @Table
            @StaticSelf
            class ${this.className} extends Model<${this.className}Attributes, ${this.className}CreationAttributes> {

            }

            export default ${this.className}
        `
    }

    protected types(): string {
        return `
            import type { ModelAttributes, ModelCreationAttributes } from "@/models/Model"

            export interface ${this.className}Attributes extends ModelAttributes { }

            export type ${this.className}CreationAttributes = ModelCreationAttributes<
                ${this.className}Attributes,
                undefined
            >
        `
    }
}
