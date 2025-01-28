import {
    Router as ExpressRouter,
    type RequestHandler,
} from "express";

type RouterDefinitionFn = (router: Router) => void

export default class Router {
    private router
    private _name?: string

    constructor (name?: string) {
        this.router = ExpressRouter()
        this._name = name
    }

    // ========================================================================

    public get schema () {
        return this.router
    }

    // ========================================================================

    public get name () {
        if (this._name) return this._name.startsWith('/')
            ? this._name
            : `/${this._name}`
        
        return '/'
    }

    // ========================================================================

    public get (path: string, ...handlers: RequestHandler[]) {
        this.router.get(path, ...handlers)
    }

    // ========================================================================

    public post (path: string, ...handlers: RequestHandler[]) {
        this.router.get(path, ...handlers)
    }

    // ========================================================================

    public put (path: string, ...handlers: RequestHandler[]) {
        this.router.get(path, ...handlers)
    }

    // ========================================================================

    public delete (path: string, ...handlers: RequestHandler[]) {
        this.router.get(path, ...handlers)
    }

    // ========================================================================
    public use (
        ...handlers: [string | RequestHandler, ...(
            RequestHandler | Router
        )[]]
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

    public group (path: string, define: RouterDefinitionFn) {
        const router = new Router()
        define(router)

        this.use(path, router)
    }
} 