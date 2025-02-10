import { ModelSource } from "./ModelSource";
import type { Models } from "@/types/Models";

class AppSource {
    private _models!: Models

    constructor() {
        this.runModelsSource()
    }

    public get models(): Models {
        return this._models
    }

    // Public Methods =========================================================
    public async loadModels(): Promise<Models> {
        return this._models ?? await ModelSource.loadModels()
    }

    // Private Methods ========================================================
    private async runModelsSource() {
        ModelSource.generateModelTypes()
        this._models = await ModelSource.loadModels()
    }
}

export default new AppSource