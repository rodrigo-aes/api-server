// Contexts
import RequestContext from "@/contexts/RequestContext"

// Config
import authConfig, { type AuthConfig } from "@/config/auth"

// Types
import type Authenticable from "./Authenticable"
import type {
    AuthCrendentials,
    AuthenticableStatic,

    AuthData
} from "./types"

// Exceptions
import { MissingAuthenticatedException } from "@/Exceptions/Auth"

type SourceKey = keyof AuthConfig['sources']

class Auth {
    // Instance Properties ====================================================
    private authenticated: Authenticable

    // Static properties ======================================================
    private static _source: AuthenticableStatic = authConfig
        .defaultSource()
        .model

    private static sourceKey: SourceKey = authConfig
        .defaultSource()
        .key as SourceKey

    // Contructor =============================================================
    private constructor(authenticated: Authenticable) {
        this.authenticated = authenticated
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
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
    public static source(source: SourceKey): typeof Auth {
        this._source = authConfig.sources[source]().model
        this.sourceKey = source
        return this
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
        const credentials = this.getCrendentials(credential)
        const where: any = {}
        for (const cred of credentials) where[cred] = credential

        return this._source.findOne({
            where
        })
    }

    // ------------------------------------------------------------------------

    private static getCrendentials(credential: string) {
        const credentialProps = this.getCredentialProps(credential)
        const credentialRelations = this.getCredentialRelations(credential)

        return [...credentialProps, ...credentialRelations]
    }

    // ------------------------------------------------------------------------

    private static getCredentialProps(credential: string) {
        const creds = authConfig.sources[this.sourceKey]().credentialProps
        const props: string[] = []

        for (const key in creds)
            if (creds[key as keyof typeof creds](credential)) props.push(key)

        return props
    }

    // ------------------------------------------------------------------------

    private static getCredentialRelations(credential: string) {
        const creds = authConfig.sources[this.sourceKey]().credentialRelations
        const relations: string[] = []

        for (const cred of creds) {
            for (const key in cred.props)
                if (cred.props[key as keyof typeof cred.props]!(credential))
                    relations.push(`$${cred.as}.${key}$`)
        }

        return relations
    }
}

export default Auth