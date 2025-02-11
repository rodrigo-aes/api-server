import MySQL, { diedMySQL } from ".";
import AppSource from "@/utils/AppSource";
import readline from "readline";

// Validation Rules
import { Boolean } from "@/validation/Rules";

// Types
import type {
    SyncOptions,
    Sequelize
} from "sequelize";

// Exceptions
import { DatabaseResetOnProductionException } from "@/Exceptions/Database";

/**
 * DatabaseMigration class execute the database migration process
 */
export class DatabaseMigration {
    private options?: SyncOptions
    private ignoreSecurity?: boolean

    constructor(options?: SyncOptions, ignoreSecurity?: boolean) {
        this.options = options
        this.ignoreSecurity = ignoreSecurity
    }

    // Public Methods =========================================================
    /**
     * Execute database migration process steps
     */
    public async execute() {
        if (this.options?.force) {
            this.verifyIgnoreSecurity()
            await this.verifyExecute()
        }

        else await this.migrate()
    }

    // Private Methods ========================================================

    /**
     * Migrate database
     */
    private async migrate() {
        await this.migrateDatabase()
        await this.migrateDiedDatabase()
    }

    // ------------------------------------------------------------------------

    /**
     * Show a question to reset database if flag --force is present
     */
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

    // ------------------------------------------------------------------------

    /**
     * Verify if flag --ignore-security is present if in env production
     * @throws {DatabaseResetOnProductionException} - If flag not present
     */
    private verifyIgnoreSecurity() {
        if (process.env.NODE_ENV === 'production')
            if (!this.ignoreSecurity)
                throw new DatabaseResetOnProductionException
    }

    // ------------------------------------------------------------------------

    /**
     * Migrate alive database
     */
    private async migrateDatabase() {
        await MySQL.init()

        Log.out(`#[warning]Migrating #[info]${MySQL.getDatabaseName()}#[warning]...`)
        Log.out('')

        await MySQL.sync(this.options)
        await MySQL.close()

        Log.out(`#[info]${MySQL.getDatabaseName()} #[success]migrated success!`)
        Log.out('')
    }

    // ------------------------------------------------------------------------

    /**
     * Migrate died database
     */
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

            await this.removeUniqueConstraints(diedMySQL)

            Log.out(`#[warning]Migrating #[info]${diedMySQL.getDatabaseName()}#[warning]...`)
            Log.out('')
            await diedMySQL.sync(this.options)
            await diedMySQL.close()

            Log.out(`#[info]${diedMySQL.getDatabaseName()} #[success]migrated success!`)
            Log.out('')
        }
    }

    // ------------------------------------------------------------------------

    /**
     * Remove the unique constraints of died database to soft deletes
     * 
     * @param {Sequelize} diedDatabase - The died database instance with models 
     * loaded 
     */
    private async removeUniqueConstraints(diedDatabase: Sequelize) {
        const models = diedDatabase.models;

        for (const modelName of Object.keys(models)) {
            const model = models[modelName];

            for (const attr of Object.keys(model.rawAttributes)) {
                if (model.rawAttributes[attr].unique) {
                    delete model.rawAttributes[attr].unique;
                }
            }

            model.init(model.rawAttributes, {
                sequelize: diedDatabase,
                modelName: modelName,
                tableName: model.getTableName() as string,
                timestamps: model.options.timestamps
            });
        }
    }
}