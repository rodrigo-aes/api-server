export default class NotImplementedMethodException extends Error {
    constructor(methodName?: string) {
        super(
            `Method ${methodName ? `${methodName} ` : ''} not implemented.`
        )

        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}