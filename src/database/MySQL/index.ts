import { Sequelize } from "sequelize-typescript"
import { MySQL } from "./Database"
import { DiedMySQL } from "./DiedDatabase"

export const diedMySQL = new DiedMySQL
export default new MySQL