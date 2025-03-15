import AppSource from "@/utils/AppSource"
import type { Models } from "@/types/Models"
import type Model from "@/models/Model"
import type { ModelStatic } from "sequelize"

export class Unique {
    public static async unique(
        model: keyof Models,
        field: string,
        value: any
    ) {
        const source = AppSource.models[model] as ModelStatic<Model>

        return !(await source.findOne({
            where: { [field]: value }
        }))
    }
}