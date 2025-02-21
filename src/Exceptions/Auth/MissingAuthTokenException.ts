export default class MissingAuthTokenException extends Error {
    constructor(methodName?: string) {
        super(
            `${methodName ? `Called ${methodName}:` : ''} Missing AuthToken`
        )

        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}