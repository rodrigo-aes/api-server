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
            default: this.testAmbientHandler(error)
        }
    }

    private testAmbientHandler(error: Error) {
        if (this.shouldIgnore(error)) return

        console.log(error)
        throw error
    }

    private shouldIgnore(error: Error) {
        return (
            error instanceof HttpResponseException
        )
    }
}

export default new UncaughtExceptionHandler