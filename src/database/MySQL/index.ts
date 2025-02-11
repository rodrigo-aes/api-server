import { MySQL } from "./Database"
import { DiedMySQL } from "./DiedDatabase"

import { DatabaseMigration } from "./DatabaseMigration"

export const diedMySQL = new DiedMySQL
export default new MySQL

export {
    DatabaseMigration
}