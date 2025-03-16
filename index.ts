import '@/contexts/AppGlobalContext'
import '@/utils/Environment'
import '@/utils/AppSource'
import '@/utils/UncaughtExceptionHandler'
import '@/schedules'
import '@/queues'

import MySQL, { diedMySQL } from '@/database/MySQL'
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

    /**
     * Instantiate the app Server class
     */
    private initServer() {
        this.server = new Server
    }
}

new App