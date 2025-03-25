import multer, {
    type Multer,
    type FileFilterCallback,
    type StorageEngine,
} from "multer"
import { resolve } from "path"
import { unlinkSync, existsSync } from "fs"

// Contexts
import RequestContext from "@/contexts/RequestContext"

// Utils
import File from "@/utils/File"

// Types
import type { Request, Response, NextFunction } from "express"
import type {
    FileValidatorInitMap,
    FileValidatorConstructor
} from "./types"


abstract class FileValidator {
    private readonly tempPath: string = resolve('src/storage/temp')
    private upload!: Multer

    private name: string | string[]
    private type: FileValidatorInitMap['type']
    private files: number
    private fileSize: number
    private loadFiles: boolean

    constructor(
        {
            name,
            type = 'single',
            files = 1,
            fileSize = 260000,
            loadFiles = false
        }: FileValidatorInitMap
    ) {
        this.name = name
        this.type = type
        this.files = files
        this.fileSize = fileSize
        this.loadFiles = loadFiles

        this.makeUpload()
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private makeUpload() {
        this.upload = multer({
            limits: {
                files: this.files,
                fileSize: this.fileSize
            },
            fileFilter: this.filter,
            storage: this.storage()
        })
    }

    // ------------------------------------------------------------------------

    private storage(): StorageEngine {
        return multer.diskStorage({
            destination: this.tempPath,
            filename: this.handleFilename,
        })
    }

    // ------------------------------------------------------------------------

    private async handleFilename(
        _: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => void
    ) {

        const filename = Str.random(160)
        const ext = file.mimetype.split('/')[1]

        return callback(null, `${filename}.${ext}`)
    }

    // ------------------------------------------------------------------------

    private async afterUpload(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        return async () => {
            if (this.loadFiles) this.loadRequestFiles()

            await this.afterValidation(
                RequestContext.req.upload ?? RequestContext.req.uploads
            )

            this.scheduleTempClear(req, res)

            return next()
        }
    }

    // ------------------------------------------------------------------------

    private loadRequestFiles() {
        const { req } = RequestContext

        if (req.file) req.upload = new File(
            req.file.buffer ?? req.file.path
        )

        if (req.files) {
            if (Array.isArray(req.files)) {
                req.uploads = []

                for (const file of req.files) req.uploads.push(
                    new File(file.buffer ?? file.path)
                )
            }

            else {
                req.uploads = {}
                for (const key in req.files)
                    for (const file of req.files[key]) {
                        if (!req.uploads[key]) req.uploads[key] = []

                        req.uploads[key].push(
                            new File(file.buffer ?? file.path)
                        )
                    }

            }
        }
    }

    // ------------------------------------------------------------------------

    private scheduleTempClear(req: Request, res: Response) {
        res.on('close', async () => {
            if (req.file) {
                console.log(existsSync(req.file.path))
                if (existsSync(req.file.path)) unlinkSync(req.file.path)

            }

            if (req.files) if (Array.isArray(req.files))
                for (const file of req.files) {
                    if (existsSync(file.path)) unlinkSync(file.path)
                }

            else for (const key in req.files)
                for (const file of req.files[key])
                    if (existsSync(file.path)) unlinkSync(file.path)
        })
    }

    // Protecteds -------------------------------------------------------------
    protected abstract filter(
        req: Request,
        file: Express.Multer.File,
        callback: FileFilterCallback
    ): void | Promise<void>

    // ------------------------------------------------------------------------

    /**
     * Exceute action with the files after validation
     * 
     * @param {Request['upload'] | Request['uploads']} data - Files
     */
    protected afterValidation(
        data: Request['upload'] | Request['uploads']
    ): void | Promise<void> {
        return
    }

    // Publics ---------------------------------------------------------------- 
    public async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        switch (this.type) {
            case "single": return this.upload.single(this.name as string)(
                req, res, await this.afterUpload(req, res, next)
            )

            case "array": return this.upload.array(
                this.name as string,
                this.files
            )(
                req, res, await this.afterUpload(req, res, next)
            )

            case "fields": return this.upload.fields(
                (this.name as string[]).map(name => ({
                    name,
                    maxCount: this.files
                }))
            )(
                req, res, await this.afterUpload(req, res, next)
            )
        }
    }
}

export default FileValidator

export type {
    FileValidatorConstructor
}