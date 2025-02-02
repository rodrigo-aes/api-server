export default class ModuleAlreadyExistsException extends Error {
    constructor(name: string) {
        super(
            `Module ${name} already exists. Use --force-override option to override file.`
        )

        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}