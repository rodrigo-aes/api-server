import type Model from "."
import type { FindOptions, Optional } from "sequelize"
import type Pagination from "./Pagination"

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

export interface ModelWithPolymorphicParent extends ModelAttributes {
    parentId: string
    parentKey: string
}

export interface PaginateOptions<T extends Model = any> extends FindOptions<T> {
    perPage: number
}

export type Paginated<TModel extends Model = any> = {
    data: TModel[]
    pagination: Pagination
}