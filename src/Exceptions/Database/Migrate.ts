export default class DatabaseResetOnProductionException extends Error {
    constructor() {
        super(
            `Migrate with flag "--force" on production environment not allowed use "--ignore-security" to reset database`
        )

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}