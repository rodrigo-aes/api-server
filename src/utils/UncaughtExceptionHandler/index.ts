// Exceptions
// -- Common
import { HttpResponseException } from "@/Exceptions/Request"

/**
 * UncaughtExceptionHandler instance handle all aplication exceptions
 */
class UncaughtExceptionHandler {
    constructor() {
        process.on('uncaughtException', this.handleException)
    }

    // Instance Methods =======================================================
    /**
     * Handle uncaught application exception 
     * 
     * @param {Error} error - Exception to handle 
     * @returns {void}
     */
    public handleException(error: Error): void {
        switch (process.env.NODE_ENV) {
            case 'production': return
            default:
                const shouldIgnore = (
                    error instanceof HttpResponseException
                )

                if (shouldIgnore) return

                console.log(error)
                throw error
        }
    }
}

export default new UncaughtExceptionHandler