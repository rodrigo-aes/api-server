import fs from "fs";
import path from "path";
import { resolve, join, extname } from "path";
import { pathToFileURL } from "url";
import { readdirSync, statSync } from "fs";
import Model from "@/models/Model";
import type { Models } from "@/types/Models";

export class ModelSource {
    private static readonly MODELS_PATH = resolve("src/models");
    private static readonly OUTPUT_FILE = resolve("src/types/Models/index.ts");

    static async loadModels(
        dir: string = ModelSource.MODELS_PATH
    ): Promise<Models> {
        const models: Record<string, typeof Model> = {};

        for (const file of readdirSync(dir)) {
            const fullPath = join(dir, file);
            const stats = statSync(fullPath);

            if (stats.isDirectory()) {
                const indexPathTs = join(fullPath, "index.ts");
                const indexPathJs = join(fullPath, "index.js");

                if (file === 'Model') continue

                if (fs.existsSync(indexPathTs)) models[file] =
                    (await ModelSource.importModel(indexPathTs)) ?? models[file];
                else if (fs.existsSync(indexPathJs)) models[file] =
                    (await ModelSource.importModel(indexPathJs)) ?? models[file];
                else
                    Object.assign(models, await ModelSource.loadModels(fullPath));

            } else if (extname(fullPath) === ".ts" || extname(fullPath) === ".js") {
                const model = await ModelSource.importModel(fullPath);
                if (model) models[file.replace(/\.(ts|js)$/, "")] = model;
            }
        }

        return models as Models;
    }

    // ========================================================================

    private static async importModel(filePath: string): Promise<typeof Model | null> {
        try {
            const fileUrl = pathToFileURL(filePath).href;
            const importedModule = await import(fileUrl);
            return Object.values(importedModule).find(
                (value) => typeof value === "function" && Object.prototype.isPrototypeOf.call(Model, value)
            ) as typeof Model | null;

        } catch (error) {
            console.error(`${filePath}:`, error);
            return null;
        }
    }

    // ========================================================================

    static generateModelTypes(): void {
        const folders = fs
            .readdirSync(ModelSource.MODELS_PATH, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

        const models = folders.filter((folder) =>
            folder !== "Model" &&
            fs.existsSync(path.join(ModelSource.MODELS_PATH, folder, "index.ts"))
        );

        const typesContent = this.typesModuleContent(models)

        if (fs.existsSync(ModelSource.OUTPUT_FILE)) {
            const existingContent = fs.readFileSync(ModelSource.OUTPUT_FILE, "utf-8").trim();
            if (existingContent === typesContent) return;
        }

        fs.writeFileSync(ModelSource.OUTPUT_FILE, typesContent);
        Log.out('#[warning]Module models.d.ts updated')
    }

    // ========================================================================

    private static typesModuleContent(models: string[]) {
        return [
            models.map((name) => `import type ${name} from "@/models/${name}/index";`).join("\n"),
            "",
            "export type Models = {",
            models.map((name) => `    ${name}: typeof ${name};`).join("\n"),
            "};",
            '\n',
            'export type PolymorphicRelationParentKey = keyof Models'
        ].join("\n");
    }
}