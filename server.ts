import express from 'express'
import https from 'https'
import cors from 'cors'

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Config 
import corsConfig from '@/config/cors'
import middlewareConfig from '@/config/middleware'

// Contexts
import RequestContext from '@/contexts/RequestContext'

// Routes
import applicactionRouter from '@/routes'

// Exceptions
import { InternalServerError500 } from '@/Exceptions/ErrorRequestHandlers'

/**
 * Instantiate a new server
 */
export default class Server {
    protected app = express()
    protected server!: https.Server

    constructor() {
        this.applyConfig()
        this.defineServer()
        this.defineContexts()
        this.defineMiddlewares()
        this.defineRouter()
        this.definePublic()
        this.defineErrorRequestHandler500()
        this.listen()
    }

    // ------------------------------------------------------------------------

    private defineServer() {
        this.server = https.createServer(
            {
                cert: readFileSync(resolve('certs/server/cert.pem')),
                key: readFileSync(resolve('certs/server/key.pem'))
            },
            this.app
        )
    }

    // ------------------------------------------------------------------------

    private applyConfig() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors(corsConfig))
        this.app.set("trust proxy", true);
    }

    // ------------------------------------------------------------------------

    private defineContexts() {
        this.app.use((req, res, next) => RequestContext.apply(req, res, next))
    }

    // ------------------------------------------------------------------------

    private defineMiddlewares() {
        middlewareConfig.global.forEach(
            middleware => this.app.use(
                (...args) => new middleware().run(...args)
            )
        )
    }

    // ------------------------------------------------------------------------

    private defineRouter() {
        this.app.use(applicactionRouter.schema)
    }

    // ------------------------------------------------------------------------

    private definePublic() {
        this.app.use(express.static(resolve('public')))
    }

    // ------------------------------------------------------------------------

    private defineErrorRequestHandler500() {
        this.app.use(InternalServerError500)
    }

    // ------------------------------------------------------------------------

    private listen() {
        this.server.listen(process.env.APP_PORT, () =>
            Log.out(`Server listening on: #[info]${process.env.APP_URL}`)
        )
    }
}