class UncaughtExceptionHandler {
    constructor() {
        process.on('uncaughtException', this.handleException)
    }

    public handleException(error: Error) {
        console.log(error)
        throw error
    }
}

export default new UncaughtExceptionHandler