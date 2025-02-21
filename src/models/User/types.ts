import type {
    AuthenticableAttributes,
    AuthenticableCreationAttibutes
} from "@/utils/Auth/types"

export interface UserAttributes extends AuthenticableAttributes { }

export type UserCreationAttributes = AuthenticableCreationAttibutes<
    UserAttributes,
    undefined
>