import { readFileSync } from "fs"
import { resolve } from "path"

class AppCache {
    private _jwtPrivateKey?: Buffer
    private _jwtPublicKey?: Buffer

    // Getters ================================================================
    /**
     * JWT private key buffer
     */
    public get jwtPrivateKey(): Buffer {
        return this._jwtPrivateKey ?? this.loadJWTPrivateKey()
    }

    // ------------------------------------------------------------------------

    /**
     * JWT public key buffer
     */
    public get jwtPublicKey(): Buffer {
        return this._jwtPublicKey ?? this.loadJWTPublicKey()
    }

    // Private Methods ========================================================
    private loadJWTPrivateKey(): Buffer {
        this._jwtPrivateKey = readFileSync(
            resolve('certs/JWT/private.pem')
        )

        return this._jwtPrivateKey
    }

    // ------------------------------------------------------------------------

    private loadJWTPublicKey(): Buffer {
        this._jwtPublicKey = readFileSync(
            resolve('certs/JWT/public.pem')
        )

        return this._jwtPublicKey
    }
}

export default new AppCache

export type {
    AppCache
}