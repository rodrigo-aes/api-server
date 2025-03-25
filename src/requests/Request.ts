import type { Request as ExpRequest, Response, NextFunction } from "express"
import type { RequestHandler } from "express"

import Middleware from '@/middlewares/Middleware'
import type { MiddlewareConstructor } from "@/middlewares"
import type { MiddlewareMap } from "@/routes/Router/types"
import Validator, {
    type ValidatorConstructor
} from "@/validation/Validator"
import FileValidator, {
    type FileValidatorConstructor
} from "@/validation/FileValidator"
import Controller, {
    type ControllerContructor
} from "@/controllers/Controller"

type ControllerTuple = [ControllerContructor, string]

export type Handler = (
    MiddlewareConstructor |
    MiddlewareMap |
    Validator |
    FileValidator |
    ValidatorConstructor |
    ControllerTuple |
    RequestHandler
)


abstract class Request {
    private _handlers: RequestHandler[] = []

    // Instance Methods =======================================================
    // Publics ---------------------------------------------------------------- 
    public requestHandlers(): RequestHandler[] {
        for (const handler of this.handlers()) switch (typeof handler) {
            case "object":
                if (Array.isArray(handler)) {
                    if (Controller.prototype.isPrototypeOf(
                        handler[0].prototype
                    ))
                        this.handleController(handler)
                }

                else if (FileValidator.prototype.isPrototypeOf(
                    handler
                )) this.handleFileValidator(handler as FileValidator)

                else this.handleMiddlware(handler as MiddlewareMap)
                break

            case "function":
                if (Middleware.prototype.isPrototypeOf(handler.prototype))
                    this.handleMiddlware(handler as MiddlewareConstructor)

                else if (Validator.prototype.isPrototypeOf(handler.prototype))
                    this.handleValidator(handler as ValidatorConstructor)

                else this._handlers.push(handler as RequestHandler)
                break
        }

        return this._handlers
    }

    // Protecteds -------------------------------------------------------------
    protected abstract handlers(): Handler[]

    // Privates ---------------------------------------------------------------
    private handleMiddlware(
        middleware: MiddlewareConstructor | MiddlewareMap
    ) {
        switch (typeof middleware) {
            case "object": this._handlers.push(
                (...args) => new (middleware as MiddlewareMap)
                    .constructor(...(middleware as MiddlewareMap).args)
                    .run(...args)
            )
                break;

            case "function": this._handlers.push(
                (...args) => new (
                    middleware as new (...args: any[]) => Middleware
                )().run(...args)
            )
                break
        }
    }

    // ------------------------------------------------------------------------

    private handleValidator(validator: Validator | ValidatorConstructor) {
        this._handlers.push(
            validator instanceof Validator
                ? () => validator.handle()
                : (...args) => new validator(...args).handle()
        )
    }

    // ------------------------------------------------------------------------

    private handleFileValidator(validator: FileValidator) {
        this._handlers.push((...args) => validator.handle(...args))
    }

    // ------------------------------------------------------------------------

    private handleController(
        [controller, method]: ControllerTuple
    ) {
        this._handlers.push(
            (req, res, next) => (
                new controller(req, res)[
                method as keyof InstanceType<typeof controller>
                ] as RequestHandler
            )(req, res, next)
        )
    }
}

export default Request

export type RequestConstructor = new () => Request