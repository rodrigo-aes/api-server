import type Model from "."
import type { FindOptions, Optional, WhereAttributeHash } from "sequelize"
import type Pagination from "./Pagination"
import type { AssociationGetOptions } from "sequelize-typescript"

export interface ModelAttributes {
    _id: string,

    createdAt: Date
    updatedAt: Date
}

export type ModelOptionalAttributes = (
    '_id' |
    'createdAt' |
    'updatedAt'
)

export type ModelCreationAttributes<
    Attributes extends ModelAttributes,
    Props extends (keyof Attributes | undefined)
> = Optional<
    Attributes,
    Props extends undefined
    ? ModelOptionalAttributes
    : ModelOptionalAttributes | Props
>

export interface PaginateOptions<T extends Model = any> extends FindOptions<T> {
    perPage: number
}

export type Paginated<TModel extends Model = any> = {
    data: TModel[]
    pagination: Pagination
}

export type LoadMap = {
    [key: string]: AssociationGetOptions
}