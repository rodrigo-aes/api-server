import type { ModelAttributes, ModelCreationAttributes } from "@/models/Model"
import type Authenticable from "./Authenticable"
import type { ModelStatic } from "sequelize"
import type AuthToken from "@/models/AuthToken"
export interface AuthenticableAttributes extends ModelAttributes {
    _password: string
    authTokens: AuthToken[] | null
}

export type AuthenticableCreationAttibutes<
    Attributes extends AuthenticableAttributes,
    Props extends (keyof Attributes | undefined)
> = ModelCreationAttributes<
    Attributes,
    Props
>

export type AuthenticableStatic = ModelStatic<Authenticable>

export type AuthCrendentials = {
    credential: string
    password: string
    remember?: boolean
}

export type AuthData = {
    type: 'Bearer'
    remember: boolean
    expireAt: Date
    token: string
}