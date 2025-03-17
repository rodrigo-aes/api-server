import { Sequelize } from "sequelize-typescript"

export class DiedMySQL extends Sequelize {
    constructor() {
        super({
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT as string),
            database: process.env.MYSQL_DIED_DATABASE,
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            dialect: 'mysql',
            logging: false
        })
    }

    // ========================================================================

    public async init() {
        Log.out(
            `Trying to connect to MySQL database #[info]${this.getDatabaseName()}...`
        )

        await this.authenticate()

        Log.out(`MySQL connection to #[info]${this.getDatabaseName()}: #[success]SUCCESS`)
    }
}