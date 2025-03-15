// Contexts
import RequestContext from "@/contexts/RequestContext"

// Config
import authConfig, {
    type AuthConfig
} from "@/config/auth"

import { Op } from "sequelize"

// Types
import Authenticable from "./Authenticable"
import type {
    AuthCrendentials,
    AuthenticableStatic,

    AuthData
} from "./types"

import type { Includeable, WhereAttributeHash } from "sequelize"

// Exceptions
import { MissingAuthenticatedException } from "@/Exceptions/Auth"

type SourceKey = keyof AuthConfig['sources']
type DefaultSource = InstanceType<typeof Auth['_default']>

class Auth {
    // Instance Properties ====================================================
    private authenticated: Authenticable

    // Static properties ======================================================
    private static _default = authConfig.defaultSource().model
    private static _source: AuthenticableStatic = this._default

    private static _sourceKey: SourceKey = authConfig
        .defaultSource()
        .key as SourceKey

    // Contructor =============================================================
    private constructor(authenticated: Authenticable) {
        this.authenticated = authenticated
    }

    // Getters ================================================================
    public get sourceKey(): SourceKey {
        return this.authenticated.constructor.name as SourceKey
    }

    public static get sourceKey(): SourceKey {
        if (!RequestContext.Auth) throw new MissingAuthenticatedException(
            'sourceKey'
        )
        return RequestContext.Auth.sourceKey
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Authenticated user
     */
    public user<T extends Authenticable = DefaultSource>(): T {
        return this.authenticated as T
    }

    // ------------------------------------------------------------------------

    /**
     * Refresh the authenticated auth token
     * @returns {Promise<AuthData>} - A object containing auth data
     */
    public async refresh(): Promise<AuthData> {
        return this.authenticated.refreshAuth()
    }

    // ------------------------------------------------------------------------

    /**
     * Expire the current authenticated token
     * @returns {Promise<void>}
     */
    public logout(): Promise<void> {
        return this.authenticated.removeAuth()
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Select authenticable source
     * 
     * @param {SourceKey} source - Authenticable source name
     * @returns {this} - `this` with selected source
     */
    public static source(source: SourceKey = this._sourceKey): typeof Auth {
        this._source = authConfig.sources[source]().model
        this._sourceKey = source
        return this
    }

    // ------------------------------------------------------------------------

    public static user<T extends Authenticable = DefaultSource>(): T {
        if (!RequestContext.Auth) throw new MissingAuthenticatedException(
            'Auth.user'
        )

        return RequestContext.Auth.user<T>()
    }

    // ------------------------------------------------------------------------

    /**
     * Attempt to authenticate user
     * 
     * @param {AuthCrendentials} credentials - A object containing `credential`
     * identifier, `password` and `remember` boolean
     * @returns {Promise<AuthData | null>} Auth object data case success and 
     * `null` case fail 
     */
    public static async attempt(credentials: AuthCrendentials): Promise<
        AuthData | null
    > {
        const { credential, password, remember } = credentials
        const authenticable = await this.findSource(credential)

        if (authenticable) if (authenticable.verifyPassword(password)) {
            const auth = await authenticable.authenticate(
                remember
            )

            RequestContext.Auth = new Auth(authenticable)

            return auth
        }

        return null
    }

    // ------------------------------------------------------------------------

    /**
     * Verify if the request authorization header contains a valid Bearer token
     * 
     * @returns {Promise<Authenticable | null>} - A autheticable entity
     * instance or `null`
     */
    public static async verify(): Promise<Authenticable | null> {
        const token = this.parseBearer()
        if (!token) return null

        const authenticable = await Authenticable.verify(token)
        if (!authenticable) return null

        RequestContext.Auth = new Auth(authenticable)

        return authenticable
    }

    // ------------------------------------------------------------------------

    /**
     * Parse the request authorization header and returna a Bearer token
     * 
     * @returns {string | null} - A token string or `null`
     */
    public static parseBearer(): string | null {
        const auth = RequestContext.req.headers.authorization
        if (!auth) return null

        const [prefix, token] = auth.split(' ')
        if (prefix !== 'Bearer') return null
        if (!token) return null

        return token
    }

    // ------------------------------------------------------------------------

    /**
     * Authenticate a autheticable entity
     * 
     * @param {Authenticable} authenticable - Authenticable entity
     * @param {boolean} remember - Boolean represeting should remember TTL
     * @default remember: false
     * @returns {AuthData} - A object containing auth data
     */
    public static async authenticate(
        authenticable: Authenticable,
        remember: boolean = false
    ): Promise<AuthData> {
        const auth = await authenticable.authenticate(remember)
        RequestContext.Auth = new Auth(authenticable)

        return auth
    }

    // ------------------------------------------------------------------------

    /**
     * Refresh the authenticated auth token
     * @returns {Promise<AuthData>} - A object containing auth data
     */
    public static refresh(): Promise<AuthData> {
        if (!RequestContext.Auth) throw new MissingAuthenticatedException(
            'Auth.refresh'
        )
        return RequestContext.Auth.refresh()
    }

    // ------------------------------------------------------------------------

    /**
     * Expire the current authenticated token
     * @returns {Promise<void>}
     */
    public static logout(): Promise<void> {
        if (!RequestContext.Auth) throw new MissingAuthenticatedException(
            'Auth.logout'
        )
        return RequestContext.Auth.logout()
    }

    // Privates ---------------------------------------------------------------
    private static async findSource(credential: string) {
        const [locals, relations] = this.getCrendentials(credential)

        const where = (locals.length > 0)
            ? locals[0]
            : null

        let authenticalble: Authenticable | null = null

        if (where) authenticalble = await this._source.findOne({
            where
        })

        if (authenticalble) return authenticalble

        for (const include of relations) {
            authenticalble = await this._source.findOne({
                include,
            })

            if (authenticalble) return authenticalble
        }

        return null
    }

    // ------------------------------------------------------------------------

    private static getCrendentials(credential: string): [
        WhereAttributeHash[], Includeable[]
    ] {
        const credentialProps = this.getCredentialProps(credential)
        const credentialRelations = this.getCredentialRelations(credential)

        return [credentialProps, credentialRelations]
    }

    // ------------------------------------------------------------------------

    private static getCredentialProps(credential: string) {
        const creds = authConfig.sources[this._sourceKey]().credentialProps
        const props: WhereAttributeHash[] = []

        for (const key in creds)
            if (creds[key as keyof typeof creds](credential)) props.push({
                [key]: credential
            })

        return props
    }

    // ------------------------------------------------------------------------

    private static getCredentialRelations(credential: string) {
        const creds = authConfig.sources[this._sourceKey]().credentialRelations
        const relations: Includeable[] = []
        for (const cred of creds) {
            const or = []

            for (const prop in cred.props) {
                const include = cred.props[prop as keyof typeof cred.props]!(
                    credential
                )

                if (include) or.push({
                    [prop]: credential
                })
            }

            relations.push({
                model: cred.model,
                as: cred.as,
                where: {
                    [Op.or]: or
                },
                required: true
            })
        }

        return relations
    }
}

export default Auth

export type AuthSourceKey = SourceKey