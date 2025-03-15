import type {
    AuthenticableAttributes,
    AuthenticableCreationAttibutes
} from "@/utils/Auth/types"

// Relations
import type Email from "../Email"
import type Phone from "../Phone"

export interface UserAttributes extends AuthenticableAttributes {
    username: string

    emails: Email[]
    phones: Phone[]
}

export type UserCreationAttributes = AuthenticableCreationAttibutes<
    UserAttributes,
    (
        'emails' |
        'phones'
    )
>

export interface UserStoreAtrributes extends UserCreationAttributes {
    email: string
    phone: string
}
