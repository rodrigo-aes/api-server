import { fileTypeFromBuffer, type FileTypeResult } from "file-type"
import { readFileSync } from "fs"
class File {
    public buffer: Buffer
    public name: string
    private _mime!: string
    private _ext!: string

    constructor(data: Buffer | string, name?: string) {
        this.buffer = data instanceof Buffer
            ? data
            : readFileSync(data)

        this.name = name ?? Str.random(160)
        this.loadTypes()
    }

    // Instance Methods =======================================================
    /**
     * Get the file mime type
     * @returns {Promise<string>} - mime type
     */
    public async mime(): Promise<string> {
        if (this._mime) return this._mime

        await this.loadTypes()
        return this._mime
    }

    // ------------------------------------------------------------------------

    /**
     * Get the file extension
     * 
     * @returns {Promise<string>} - File extension
     */
    public async ext(): Promise<string> {
        if (this._ext) return this._ext

        await this.loadTypes()
        return this._ext
    }

    // Privates ---------------------------------------------------------------
    private async loadTypes() {
        const { mime, ext } = (await fileTypeFromBuffer(this.buffer))!
        this._mime = mime
        this._ext = ext
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get file type
     * 
     * @param {string | Buffer} file - Buffer or path to file
     * @returns {FileTypeResult | undefined} - A promised object with file 
     * mime type and extension
     */
    public static types(file: Buffer | string): Promise<
        FileTypeResult | undefined
    > {
        if (typeof file === 'string') file = readFileSync(file)
        return fileTypeFromBuffer(file)
    }

}

export default File