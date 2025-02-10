import '@/contexts/AppGlobalContext'
import '@/utils/Environment'
import '@/utils/AppSource'
import '@/utils/UncaughtExceptionHandler'
import MySQL, { diedMySQL } from '@/database/MySQL'

import {
    ServerAccessDatabase
} from '@/database/Redis'

import Server from "./server"

import { Boolean } from '@/validation/Rules'
/**
 * Instantiate the application
 */
class App {
    /**
     * App Server instance
     */
    private server!: Server

    constructor() {
        this.init()
    }

    // ========================================================================

    /**
     * Init application
     */
    private async init() {
        await this.initMySQLDatabase()
        await this.initMySQLDiedDatabase()
        await this.initRedisDatabases()
        await this.initServer()
    }

    // ------------------------------------------------------------------------

    /**
     * Connect MySQL database
     * @returns {Promise<void>}
     */
    private async initMySQLDatabase() {
        return MySQL.init()
    }

    // ------------------------------------------------------------------------

    /**
     * Connect MySQL died database if abilited
     * @returns {Promise<void>}
     */
    private async initMySQLDiedDatabase() {
        const shouldInit = Boolean.parse(
            process.env.MYSQL_USE_DIED_DATABASE
        )

        if (shouldInit) return diedMySQL.init()
    }

    // ------------------------------------------------------------------------

    private async initRedisDatabases() {
        Log.out('#[warning]Trying to connect #[info]Redis #[warning]databases...')
        Log.out('\n')
        await ServerAccessDatabase.connect(() => Log.out(
            `#[success]Redis #[info]ServerAccessDatabase #[success]connected`
        ))

        Log.out('\n')
        Log.out('#[info]Redis #[success]databases connected successfuly.')
        Log.out('\n')
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate the app Server class
     */
    private initServer() {
        this.server = new Server
    }
}

new App