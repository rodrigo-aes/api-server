import type Model from "."
import type { FindOptions } from "sequelize"
import type Pagination from "./Pagination"

export interface ModelAttributes {
    _id: string,
    createdAt: Date
    updatedAt: Date
}

export interface PaginateOptions<T extends Model = any> extends FindOptions<T> {
    perPage: number
}

export type Paginated<TModel extends Model = any> = {
    data: TModel[]
    pagination: Pagination
}