import { resolve, dirname, basename, extname } from "path"
import {
    readFileSync,
    writeFileSync,
    mkdirSync,
    existsSync,
    unlinkSync,
    symlinkSync,
    lstatSync,
    renameSync,

} from "fs"

import RequestContext from "@/contexts/RequestContext"

// Utils
import File from "@/utils/File"

// Types
import type { Response } from "express"
import type {
    DestTypeInfo,
    StorageResponseType,
    MakeResponseOptions
} from "./types"

// Exceptions
import { FileAlreadyExistsException } from "@/Exceptions/Storage"

class Storage {
    private static readonly BASE_PATH = process.env.STORAGE_PATH ?? resolve(
        'src/storage'
    )

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get file in storage
     * 
     * @param {string} path - File path 
     * @returns {Buffer | undefined} - `Buffer` case file exists `undefined`
     * case inexistent 
     */
    public static get(path: string): File | undefined {
        path = this.addBaseToPath(path)

        if (existsSync(path)) return new File(
            readFileSync(path),
            basename(path)
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Put a file into storage folder
     * 
     * @param {string} path - Directory path 
     * @param {Buffer} file - File Buffer 
     * @returns {Promise<string>} - Fullpath of the file
     */
    public static async put(
        path: string,
        file: File | Buffer | string
    ): Promise<
        string | null
    > {
        if (!this.exists(path)) this.makeDir(path)

        if (typeof file === 'string') return this.move(
            file, path
        )

        if (file instanceof Buffer) file = new File(file)

        const fullPath = this.genFileName(path, await file.ext())
        this.writeFile(fullPath, file)

        console.log(fullPath.length)

        return fullPath
    }

    // ------------------------------------------------------------------------

    /**
     * Move a storage file
     * 
     * @param {string} origin - Origin path 
     * @param {string} dest - Destination path
     * @returns {string | null} - The new path or `null` case origin is 
     * inexistent
     */
    public static move(origin: string, dest: string): string | null {
        origin = this.addBaseToPath(origin)
        if (!existsSync(origin)) return null

        dest = this.addBaseToPath(dest)

        if (lstatSync(dest).isDirectory()) dest = this.genFileName(
            dest, extname(origin)
        )

        renameSync(origin, dest)
        return dest
    }

    // ------------------------------------------------------------------------

    /**
     * Verify if file exists
     * 
     * @param {string} path - File path 
     * @returns {boolean} - A boolean representing if file exists
     */
    public static exists(path: string): boolean {
        path = this.addBaseToPath(path)
        return existsSync(path)
    }

    // ------------------------------------------------------------------------

    /**
     * Rename a file in a storage directory 
     * 
     * @param {string} path - File path 
     * @param {string | undefined} newName - New name
     * @returns {string | null} - New name case file exists or `null` case 
     * inexistent
     * @throws Error case passed new name already exists
     */
    public static rename(path: string, newName?: string): string | null {
        path = this.addBaseToPath(path)
        if (!existsSync(path)) return null

        const dir = dirname(path)
        const ext = extname(path)

        if (newName) {
            const filePath = `${path}/${newName}.${ext}`

            if (existsSync(filePath)) throw new FileAlreadyExistsException(
                filePath
            )
        }
        else newName = this.genFileName(dir, ext)

        renameSync(path, newName)

        return newName
    }

    // ------------------------------------------------------------------------

    /**
     * Create a new folder into app storage
     * 
     * @param {string} path - Dir path 
     * @returns {string} - Full path of the new folder 
     */
    public static async makeDir(path: string, publicDir = false): Promise<
        string
    > {
        path = this.addBaseToPath(path)

        if (!existsSync(path)) mkdirSync(path, {
            recursive: true
        })

        if (publicDir) await this.publicLink(path)

        return path
    }

    // ------------------------------------------------------------------------

    /**
     * Create a symbolic link of storage target on app public path
     * 
     * @param {string} path - Source path 
     */
    public static async publicLink(path: string): Promise<void> {
        path = this.addBaseToPath(path)

        if (existsSync(path)) symlinkSync(
            path,
            resolve('public', basename(path)),
            (await this.destType(path)).type
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Generate a new unique filename on directory
     * 
     * @param {string} path - Dir path 
     * @param {string} ext - File extension 
     * @returns {string} - New filename fullpath
     */
    public static genFileName(
        path: string,
        ext: string
    ): string {
        path = this.addBaseToPath(path)
        const existentLength = `${path}/.${ext}`.length

        let fileName: string
        do fileName = `${path}/${Str.random(255 - existentLength)}.${ext}`
        while (existsSync(fileName))

        return fileName
    }

    // ------------------------------------------------------------------------

    /**
     * Replace a existent file or create a new on full file path
     * 
     * @param {string} path - File path 
     * @param {Buffer} newFile - File buffer 
     * @returns {string} - File path
     */
    public static replace(path: string, newFile: Buffer): string {
        path = this.addBaseToPath(path)
        this.writeFile(path, newFile)
        return path
    }

    // ------------------------------------------------------------------------

    /**
     * Unlink file if exists
     * 
     * @param {string} path - File Path 
     * @returns {void}
     */
    public static delete(path: string): void {
        path = this.addBaseToPath(path)
        if (!existsSync(path)) return unlinkSync(path)
    }

    // ------------------------------------------------------------------------

    /**
     * Verify and return the type of the dest path
     * @param {string} path - Dest path 
     * @returns {Promise<DestTypeInfo>} - A object containing dest details
     */
    public static async destType(path: string): Promise<DestTypeInfo> {
        path = this.addBaseToPath(path)
        return (lstatSync(path).isDirectory())
            ? { type: 'dir' }
            : { type: 'file', ...(await File.types(path))! }
    }

    // ------------------------------------------------------------------------

    /**
     * Make a response with the file path
     * 
     * @param {string} path - File path 
     * @param {StorageResponseType} responseType - response type 
     * (inline, download) 
     * @param {MakeResponseOptions} options - Options 
     * @returns {Response} - Express response
     */
    public static makeResponse(
        path: string,
        responseType?: StorageResponseType,
        options?: MakeResponseOptions
    ): Response {
        const file = this.get(path)
        const { res } = RequestContext

        if (!file) return this.response404()

        const contentDisposition = this.defineContentDisposition(responseType)
        const filename = options?.filename ?? basename(path)

        res.setHeader(
            'Content-Disposition',
            `${contentDisposition}; filename=${filename}`
        )

        if (options?.cache) this.handleCacheControl(options.cache)

        return res.send(file)
    }

    // Privates ---------------------------------------------------------------
    private static addBaseToPath(path: string) {
        return (!path.startsWith(this.BASE_PATH))
            ? `${this.BASE_PATH}/${path}`
            : path
    }

    // ------------------------------------------------------------------------

    private static writeFile(path: string, file: File | Buffer) {
        path = this.addBaseToPath(path)

        return writeFileSync(path,
            file instanceof Buffer ? file : file.buffer
        )
    }

    // ------------------------------------------------------------------------

    private static handleCacheControl(
        cacheOptions: MakeResponseOptions['cache']
    ) {
        if (cacheOptions?.maxAge instanceof Date)
            cacheOptions.maxAge = new AppDate().diff('s', cacheOptions.maxAge)

        const policyControl = cacheOptions?.policy ?? 'no-store'
        const maxAge = `max-age=${cacheOptions?.maxAge ?? 0}`

        RequestContext.res.setHeader('Cache-Control',
            `${policyControl}, ${maxAge}`
        )
    }

    // ------------------------------------------------------------------------

    private static response404() {
        return RequestContext.res.status(404).json({
            error: 'The requested file not exist'
        })
    }

    // ------------------------------------------------------------------------

    private static defineContentDisposition(
        responseType?: StorageResponseType
    ) {
        if (!responseType) responseType = (
            RequestContext.req.query.response_type ?? 'inline'
        ) as StorageResponseType

        switch (responseType) {
            case "inline": return 'inline'
            case "download": return 'attachment'
        }
    }
}

export default Storage