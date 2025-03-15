import Model from "@/models/Model"
import {
    Column,
    DataType,
    AllowNull,

    // Relations
    HasMany,

    // Hooks
    BeforeCreate
} from "sequelize-typescript"

// Relations
import AuthToken from "@/models/AuthToken"

// Utils
import Hash from "@/utils/Hash"

// Types
import type {
    AuthenticableAttributes,
    AuthenticableCreationAttibutes,

    AuthData
} from "./types"

// Exceptions
import { MissingAuthTokenException } from "@/Exceptions/Auth"
import { NotImplementedMethodException } from "@/Exceptions/Common"

/**
 * Authenticable class model - Extends this to make a model a authenticable
 * entity
 */
abstract class Authenticable<
    TModelAttributes extends AuthenticableAttributes = any,
    TCreationAttributes extends AuthenticableCreationAttibutes<
        AuthenticableAttributes,
        '_password'
    > = any
> extends Model<TModelAttributes, TCreationAttributes> {
    // Columns ================================================================
    @AllowNull(false)
    @Column(DataType.STRING)
    declare public _password: string;

    // Relations ==============================================================
    @HasMany(() => AuthToken, {
        foreignKey: 'authenticableId',
        as: 'authTokens',
        constraints: false,
        foreignKeyConstraint: false,
    })
    public authTokens: AuthToken[] | null = null;

    // Properties =============================================================
    // Protecteds -------------------------------------------------------------
    protected authenticableHidden: (keyof AuthenticableAttributes)[] = [
        '_password'
    ]

    protected get hidden(): (keyof TModelAttributes)[] {
        return [
            ...this._hidden,
            ...this.authenticableHidden
        ]
    }

    // Privates ---------------------------------------------------------------
    private authToken: AuthToken | null = null

    // Getters ================================================================
    /**
     * Password hash
     */
    public get password(): string {
        return this._password
    }

    // Setters ================================================================
    /**
     * Password setter with hash
     */
    public set password(password: string) {
        this._password = Hash.make(password)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * 
     * @param {boolean} remember - A boolean to should remember TTL ou default
     * TTL 
     * @returns {Promise<AuthData>} - A object containing auth data
     */
    public async authenticate(remember: boolean = false): Promise<AuthData> {
        const { token, instance } = await AuthToken.sign(this, remember)

        if (!this.authTokens) this.authTokens = []
        this.authTokens.push(instance)
        this.authToken = instance

        return {
            ...instance.toJSON(),
            token
        }
    }

    // ------------------------------------------------------------------------

    /**
     * Refresh authenticated auth token
     * @returns {Promise<AuthData>} - A object containing auth data
     */
    public async refreshAuth(): Promise<AuthData> {
        if (!this.authToken) throw new MissingAuthTokenException('refreshAuth')

        const { instance, token } = await this.authToken.refresh()
        return {
            ...instance.toJSON(),
            token
        }
    }

    // ------------------------------------------------------------------------

    public async removeAuth() {
        if (!this.authToken) throw new MissingAuthTokenException('removeAuth')
        return this.authToken.destroy()
    }

    // ------------------------------------------------------------------------

    /**
     * Verify user password
     * 
     * @param {string} password - Password to verify
     * @returns {boolean} - A boolean `true` case password correct and `false`
     * case incorrect
     */
    public verifyPassword(password: string): boolean {
        return Hash.compare(password, this._password)
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Register new Authenticavle entity on database
     * 
     * @param {any} data - Register authenticable data
     */
    public static register(data: any): Promise<Authenticable> {
        throw new NotImplementedMethodException('register')
    }

    // ------------------------------------------------------------------------

    /**
     * Veridy if is a valid token and returns the authenticable and auth token
     * objects
     * 
     * @param {string} token - JWT token to verify
     * @returns {{ instance: AuthToken, authenticable: Authenticable }} - A 
     * object containing `AuthToken` and `Authenticable` instances case token
     * is valid and `null` case invalid 
     */
    public static async verify(token: string): Promise<Authenticable | null> {
        const auth = await AuthToken.verify(token)
        if (!auth) return null

        const { instance, authenticable } = auth

        if (!authenticable.authTokens) authenticable.authTokens = []
        authenticable.authTokens.push(instance)
        authenticable.authToken = instance

        return authenticable
    }

    // Hooks ==================================================================
    @BeforeCreate
    protected static hashPassword(instance: Authenticable): void {
        const _password = Hash.make(instance._password)
        instance.fill({ _password })
    }
}

export default Authenticable