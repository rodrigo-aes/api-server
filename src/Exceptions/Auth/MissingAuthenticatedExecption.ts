export default class MissingAuthenticatedException extends Error {
    constructor(methodName?: string) {
        super(
            `${methodName ? `Called ${methodName}:` : ''} Missing authenticated`
        )

        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}