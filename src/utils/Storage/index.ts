import { resolve, dirname, basename } from "path"
import {
    writeFileSync,
    mkdirSync,
    existsSync,
    unlinkSync
} from "fs"

// Utils
import File from "@/utils/File"

class Storage {
    private static readonly BASE_PATH = process.env.STORAGE_PATH ?? resolve(
        'src/storage'
    )

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Put a file into storage folder
     * 
     * @param {string} path - Directory path 
     * @param {Buffer} file - File Buffer 
     * @returns {Promise<string>} - Fullpath of the file
     */
    public static async put(path: string, file: Buffer): Promise<string> {
        const { ext } = (await File.bufferType(file))!
        const fullPath = this.genFileName(path, ext)

        this.writeFile(fullPath, file)

        return fullPath
    }

    // ------------------------------------------------------------------------

    /**
     * Create a new folder into app storage
     * 
     * @param {string} path - Dir path 
     * @returns {string} - Full path of the new folder 
     */
    public static makeDir(path: string): string {
        this.addBaseToPath(path)

        if (!existsSync(path)) mkdirSync(path, {
            recursive: true
        })

        return path
    }

    // ------------------------------------------------------------------------

    /**
     * Generate a new unique filename on directory
     * 
     * @param {string} path - Dir path 
     * @param {string} ext - File extension 
     * @returns {string} - New filename fullpath
     */
    public static genFileName(path: string, ext: string) {
        this.addBaseToPath(path)
        const existentLength = `${path}/.${ext}`.length

        let fileName: string;
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
        this.addBaseToPath(path)
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
        this.addBaseToPath(path)
        if (!existsSync(path)) return unlinkSync(path)
    }

    // Privates ---------------------------------------------------------------
    private static addBaseToPath(path: string) {
        if (!path.startsWith(this.BASE_PATH)) path = `${this.BASE_PATH}/${path}`
    }

    // ------------------------------------------------------------------------

    private static writeFile(path: string, file: Buffer) {
        this.addBaseToPath(path)
        const dir = dirname(path)
        this.makeDir(dir)

        return writeFileSync(`${this.BASE_PATH}/${path}`, file)
    }
}

export default Storage