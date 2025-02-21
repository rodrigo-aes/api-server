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
    constructor() {
        super();
        this.mergeHidden()
    }

    @AllowNull(false)
    @Column(DataType.STRING)
    private _password!: string

    @HasMany(() => AuthToken, {
        as: 'authTokens',
        constraints: false,
        foreignKeyConstraint: false,
        onDelete: 'CASCADE',
        foreignKey: 'authenticableId',
    })
    public authTokens: AuthToken[] | null = null

    // Properties =============================================================
    // Protecteds -------------------------------------------------------------
    protected hidden: (keyof AuthenticableAttributes)[] = ['_password']

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

    // Privates ---------------------------------------------------------------
    private mergeHidden() {
        const childHidden = Reflect.get(this, 'hidden') ?? [];

        this.hidden = Array.from(new Set([
            ...this.hidden,
            ...childHidden,
        ]));
    }

    // Hooks ==================================================================
    @BeforeCreate
    protected static hashPassword(instance: Authenticable): void {
        instance._password = Hash.make(instance._password)
    }
}

export default Authenticable