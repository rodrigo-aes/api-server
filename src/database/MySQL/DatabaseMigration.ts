import MySQL, { diedMySQL } from ".";
import AppSource from "@/utils/AppSource";
import readline from "readline";

import { type SyncOptions } from "sequelize";

import { Boolean } from "@/validation/Rules";

export class DatabaseMigration {
    private options?: SyncOptions

    constructor(options?: SyncOptions) {
        this.options = options
    }

    // ========================================================================

    public async execute() {
        if (this.options?.force) await this.verifyExecute()
        else await this.migrate()
    }

    // ========================================================================

    private async migrate() {
        await this.migrateDatabase()
        await this.migrateDiedDatabase()
    }

    // ========================================================================

    private async verifyExecute() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(Log.colors.warning("You're sure you want to reset the database? [Y]es/[N]o: "),
            async answer => {
                if (answer.toLowerCase().startsWith('y')) await this.migrate()

                rl.close()
            }
        )
    }

    // ========================================================================

    private async migrateDatabase() {
        await MySQL.init()

        Log.out(`#[warning]Migrating #[info]${MySQL.getDatabaseName()}#[warning]...`)
        Log.out('')

        await MySQL.sync(this.options)
        await MySQL.close()

        Log.out(`#[info]${MySQL.getDatabaseName()} #[success]migrated success!`)
        Log.out('')
    }

    // ========================================================================

    private async migrateDiedDatabase() {
        const shouldMigrate = Boolean.parse(
            process.env.MYSQL_USE_DIED_DATABASE
        )

        if (shouldMigrate) {
            Log.out('==============================================================\n')
            diedMySQL.addModels(
                Object.values(await AppSource.loadModels())
            )

            await diedMySQL.init()

            Log.out(`#[warning]Migrating #[info]${diedMySQL.getDatabaseName()}#[warning]...`)
            Log.out('')
            await diedMySQL.sync(this.options)
            await diedMySQL.close()

            Log.out(`#[info]${diedMySQL.getDatabaseName()} #[success]migrated success!`)
            Log.out('')
        }
    }
}