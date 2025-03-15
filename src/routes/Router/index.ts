import {
    Router as ExpressRouter,
    type RequestHandler,
} from "express";

import Request, { type RequestConstructor } from "@/requests/Request"

import type {
    RouterDefinitionFn,
    MiddlewareArg,
    MiddlewareMap,
    Middleware
} from "./types";

export default class Router {
    private router
    private _name?: string

    constructor(name?: string) {
        this.router = ExpressRouter()
        this._name = name
    }

    // ========================================================================

    public get schema() {
        return this.router
    }

    // ========================================================================

    public get name() {
        if (this._name) return this._name.startsWith('/')
            ? this._name
            : `/${this._name}`

        return '/'
    }

    // ========================================================================

    public get(
        path: string,
        ...handlers: (RequestConstructor | RequestHandler)[]
    ) {
        this.router.get(path, ...this.makeHandlers(...handlers))
    }

    // ========================================================================

    public post(
        path: string,
        ...handlers: (RequestConstructor | RequestHandler)[]
    ) {
        this.router.post(path, ...this.makeHandlers(...handlers))
    }

    // ========================================================================

    public put(
        path: string,
        ...handlers: (RequestConstructor | RequestHandler)[]
    ) {
        this.router.put(path, ...this.makeHandlers(...handlers))
    }

    // ========================================================================

    public delete(
        path: string,
        ...handlers: (RequestConstructor | RequestHandler)[]
    ) {
        this.router.delete(path, ...this.makeHandlers(...handlers))
    }

    // ========================================================================
    public use(
        ...handlers: [
            string | RequestHandler,
            ...(RequestHandler | Router)[]
        ]
    ) {
        this.router.use(...handlers.map(
            handler => {
                switch (typeof handler) {
                    case "string":
                    case "function": return handler
                    case "object": return handler.schema
                }
            }
        ) as [string, ...RequestHandler[]])
    }

    // ========================================================================

    public prefix(path: string, define: RouterDefinitionFn) {
        const router = new Router()
        define(router)

        this.use(path, router)
    }

    // ========================================================================

    public middleware(
        path: string,
        middlewares: MiddlewareArg | MiddlewareArg[],
        define: RouterDefinitionFn
    ) {
        const router = new Router()

        if (Array.isArray(middlewares)) middlewares.forEach(
            middleware => this.applyMidlewareArg(router, middleware)
        )
        else this.applyMidlewareArg(router, middlewares)

        define(router)
        this.use(path, router)
    }

    // ========================================================================

    public makeHandlers(
        ...handlers: (RequestConstructor | RequestHandler)[]
    ): RequestHandler[] {
        let h: RequestHandler[] = []

        for (const handler of handlers) {
            if (Request.prototype?.isPrototypeOf(handler.prototype))
                h = [
                    ...h,
                    ...new (handler as RequestConstructor)().requestHandlers()
                ]
            else h.push(handler as RequestHandler)
        }


        return h
    }

    // ========================================================================

    private applyMidlewareArg(
        router: Router,
        middleware: MiddlewareArg,
    ) {
        switch (typeof middleware) {
            case "object": router.use(
                (...args) => new (middleware as MiddlewareMap)
                    .constructor(...(middleware as MiddlewareMap).args)
                    .run(...args)
            )
                break

            case "function": this.router.use(
                (...args) => new (
                    middleware as new (...args: any[]) => Middleware
                )().run(...args)
            )
                break
        }
    }
} 