import type { ModelAttributes, ModelCreationAttributes } from "@/models/Model"

// Relations
import type User from "../User"

export interface PhoneAttributes extends ModelAttributes {
    parentId: string
    parentKey: 'User'

    user: User | null

    complete: string
    countryCode: string
    areaCode: string
    number: string

    formated: string
    formatedLocal: string
}

export type PhoneCreationAttributes = ModelCreationAttributes<
    PhoneAttributes,
    (
        'parentKey' |
        'countryCode' |
        'areaCode' |
        'number' |
        'formated' |
        'formatedLocal'
    )
>