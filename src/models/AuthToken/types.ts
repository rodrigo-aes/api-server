import type { ModelAttributes, ModelCreationAttributes } from "@/models/Model"
import type { AuthConfig } from "@/config/auth"

export interface AuthTokenAttributes extends ModelAttributes {
    authenticableId: string
    sourceKey: keyof AuthConfig['sources']

    type: 'Bearer'
    jwtid: string
    deviceId: string | null
    ip: string

    remember: boolean
    expireAt: Date
}

export type AuthTokenCreationAttributes = ModelCreationAttributes<
    AuthTokenAttributes,
    (
        'ip' |
        'type' |
        'deviceId' |
        'remember' |
        'expireAt'
    )
>