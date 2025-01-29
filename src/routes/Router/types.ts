import type Router from "."
import type Middleware from "@/middlewares/Middleware"

export type RouterDefinitionFn = (router: Router) => void

// Middleware -----------------------------------------------------------------
export type MiddlewareMap = {
    constructor: new (...args: any[]) => Middleware,
    args: any[]
}

export type MiddlewareArg = (new (...args: any[]) => Middleware) | MiddlewareMap

export {
    Middleware
}