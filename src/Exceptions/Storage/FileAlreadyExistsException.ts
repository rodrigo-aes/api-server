export default class FileAlreadyExistsException extends Error {
    constructor(filePath?: string) {
        super(
            `File ${filePath ? `${filePath} ` : ''} already exists.`
        )

        this.name = this.constructor.name;

        if (Error.captureStackTrace) Error.captureStackTrace(
            this, this.constructor
        )

    }
}