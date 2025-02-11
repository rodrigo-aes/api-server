import { Sequelize } from "sequelize-typescript"
import AppSource from "@/utils/AppSource"

export class MySQL extends Sequelize {
    constructor() {
        super({
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT as string),
            database: process.env.MYSQL_DATABASE,
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            dialect: 'mysql',
            logging: false
        })
    }

    // ========================================================================

    public async init() {
        Log.out(
            `#[warning]Trying to connect to #[info]MySQL database #[warning]${this.getDatabaseName()}...`
        )

        await this.loadModels()
        await this.authenticate()

        Log.out(`#[info]MySQL connection to #[warning]${this.getDatabaseName()}: #[success]SUCCESS`)
        Log.out('')
    }

    // ========================================================================

    private async loadModels() {
        this.addModels(Object.values(await AppSource.loadModels()))
    }
}