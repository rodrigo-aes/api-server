import type Model from "."
import type { FindOptions } from "sequelize"

export interface PaginateOptions<T extends Model = any> extends FindOptions<T> {
    perPage: number
}  