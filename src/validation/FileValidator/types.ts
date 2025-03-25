import type { Options } from "multer"
import FileValidator from "."

export type FileValidatorInitMap = {
    name: string | string[],
    type?: 'single' | 'array' | 'fields'
    files?: number
    fileSize?: number
    loadFiles?: boolean
}

export type FileValidatorConstructor = new (
    initMap: FileValidatorInitMap
) => FileValidator