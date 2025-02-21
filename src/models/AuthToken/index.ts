import Model, { StaticSelf } from "@/models/Model"
import JWT from "@/utils/JWT"
import {
    Table,
    Column,
    DataType,
    AllowNull,
    Default,
    Unique,

    // Hooks
    BeforeValidate
} from "sequelize-typescript"

// Contexts
import RequestContext from "@/contexts/RequestContext"

// Config
import authConfig, { type AuthConfig } from "@/config/auth"

// Types
import type Authenticable from "@/utils/Auth/Authenticable"
import type { AuthTokenAttributes, AuthTokenCreationAttributes } from "./types"

@Table
@StaticSelf
class AuthToken extends Model<
    AuthTokenAttributes,
    AuthTokenCreationAttributes
> {
    @AllowNull(false)
    @Column(DataType.STRING)
    public authenticableId!: string

    @AllowNull(true)
    @Column(DataType.STRING)
    public deviceId!: string | null

    @AllowNull(false)
    @Column(DataType.STRING)
    public sourceKey!: keyof AuthConfig['sources']

    @Default('Bearer')
    @AllowNull(false)
    @Column(DataType.ENUM('Bearer'))
    public type!: 'Bearer'

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    public jwtid!: string

    @AllowNull(false)
    @Column(DataType.STRING)
    public ip!: string

    @Default(false)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    public remember!: boolean

    @AllowNull(false)
    @Column(DataType.DATE)
    public expireAt!: Date

    public authenticable: Authenticable | null = null

    // Properties =============================================================
    // Protecteds -------------------------------------------------------------
    protected hidden: (keyof AuthTokenAttributes)[] = [
        '_id',
        'authenticableId',
        'ip',
        'deviceId',
        'jwtid',
        'sourceKey',
        'createdAt',
        'updatedAt',
    ]

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------

    /**
     * Refresh auth token expire date
     * 
     * @returns {Promise<{ instance: AuthToken, token: string }>} - A object
     * containing `instance` of AuthToken and `token` string
     */
    public async refresh(): Promise<{ instance: AuthToken, token: string }> {
        const source = authConfig.sources[this.sourceKey]().model
        const authenticable = (await source.findByPk(this.authenticableId))!

        const jwtid = Str.random(255)
        const token = JWT.sign(authenticable, jwtid, this.remember)

        this.jwtid = jwtid
        this.expireAt = AuthToken.handleExpireAt(this.remember)
        const instance = await this.save()

        return {
            instance,
            token
        }
    }

    // ------------------------------------------------------------------------

    public async loadAuthenticable() {
        const source = authConfig.sources[this.sourceKey]().model
        this.authenticable = await source.findByPk(this.authenticableId)
        return this.authenticable
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Create a AuthToken register in database and return instance
     * @param {Authenticable} authenticable - Authenticable instance
     * @param {boolean} remember - Remember TLL boolean
     * @default false
     * 
     * @returns {Promise<{ instance: AuthToken, token: string }>} - A object
     * containing `instance` of AuthToken and `token` string
     */
    public static async sign(
        authenticable: Authenticable,
        remember: boolean
    ): Promise<{ instance: AuthToken, token: string }> {
        const jwtid = Str.random(255)
        const token = JWT.sign(authenticable.toJSON(), jwtid, remember)
        const sourceKey = authenticable.constructor.name as keyof AuthConfig[
            'sources'
        ]

        const instance = await super.create<AuthToken>({
            authenticableId: authenticable._id,
            sourceKey,
            jwtid
        })

        return {
            instance,
            token
        }
    }

    // ------------------------------------------------------------------------

    /**
     * 
     * @param {string} token - JWT token to verify 
     * @returns {Promise<
     *  { instance: AuthToken, authenticable: Authenticable } | null
     * >} - A object containing `AuthToken` instance and `Authenticable` or 
     * `null` case token invalid
     */
    public static async verify(token: string): Promise<
        { instance: AuthToken, authenticable: Authenticable } | null
    > {
        const decoded = JWT.verify(token)
        if (decoded) {
            const instance = await this.findByJwtId(decoded.jti as string)

            if (instance) {
                const authenticable = await instance.loadAuthenticable()

                if (authenticable) return {
                    instance,
                    authenticable
                }
            }
        }

        return null
    }

    // ------------------------------------------------------------------------

    public static findByJwtId(jwtid: string) {
        return this.findOne({
            where: { jwtid }
        })
    }

    // Privates ---------------------------------------------------------------
    private static getRequestIP(): string {
        return RequestContext.req!.ip!
    }

    // ------------------------------------------------------------------------

    private static handleExpireAt(remember: boolean = false) {
        const [count, type] = remember
            ? process.env.AUTH_TOKEN_REMEMBER_TTL!.split(' ')
            : process.env.AUTH_TOKEN_DEFAULT_TTL!.split(' ')

        return new AppDate().add({
            [type]: parseInt(count)
        })
    }

    // Hook ===================================================================
    @BeforeValidate
    protected static handleAttributes(instance: AuthToken) {
        instance.ip = this.getRequestIP()
        instance.expireAt = this.handleExpireAt(instance.remember)
    }
}

export default AuthToken