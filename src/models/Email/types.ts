import type { ModelAttributes, ModelCreationAttributes } from "@/models/Model"

// Relations
import User from "../User"

export interface EmailAttributes extends ModelAttributes {
    parentId: string
    parentKey: 'User'

    user: User | null

    address: string
    local: string
    domain: string
}

export type EmailCreationAttributes = ModelCreationAttributes<
    EmailAttributes,
    (
        'parentKey' |
        'domain' |
        'local'
    )
>