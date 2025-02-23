import RequestContext from "@/contexts/RequestContext";
import { Response } from "express";

type ResponseExceptionMap = {
    body?: any,
    status: number
}
export type ResponseException = Response | ResponseExceptionMap

/**
 * Throw a HttpResponseException to send a response exception to client and 
 * close the application request process in all application request context
 */
export default class HttpResponseException extends Error {
    private response: ResponseException

    constructor(response: ResponseException) {
        super()
        this.name = this.constructor.name;

        this.response = response

        this.sendAndClose()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // Instance Methods =======================================================
    // Privates --------------------------------------------------------------- 
    private sendAndClose() {
        const res = RequestContext.res
        if (this.response instanceof Response) res.send(this.response)

        else res.status((this.response as ResponseExceptionMap).status).send(
            (this.response as ResponseExceptionMap).body
        )

        res.end()
    }
}