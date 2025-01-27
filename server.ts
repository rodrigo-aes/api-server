import express from 'express'
import https from 'https'
import cors from 'cors'

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Config 
import corsConfig from './src/config/cors'

/**
 * Instantiate a new server
 */
export default class Server {
    protected app = express()
    protected server!: https.Server

    constructor () {
        this.applyConfig()
        this.defineServer()
        this.listen()
    }

    // ------------------------------------------------------------------------
    
    private defineServer () {
        this.server = https.createServer(
            {
                cert: readFileSync(resolve('certs/server/cert.pem')),
                key: readFileSync(resolve('certs/server/key.pem'))
            },
            this.app
        )
    }

    // ------------------------------------------------------------------------

    private applyConfig () {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors(corsConfig))
    }

    // ------------------------------------------------------------------------

    private listen () {
        this.server.listen(process.env.PORT, () =>
            Log.out(`Server listening on: #[info]${process.env.APP_URL}`)
        )
    }
}