import jwt from 'jsonwebtoken'

class JWT {
    /**
     * @param {string | Buffer | object} payload - Token data
     * @param {boolean} remember - Boolean to remeber TTL
     * @default false
     * @returns {{ jwtid: string, token: string }} - A object containing JWT-ID
     * and token
     */
    public static sign(
        payload: string | Buffer | object,
        jwtid: string,
        remember: boolean = false
    ) {
        const token = jwt.sign(payload, AppCache.jwtPrivateKey, {
            jwtid,
            algorithm: 'RS256',
            expiresIn: remember
                ? process.env.AUTH_TOKEN_REMEMBER_TTL as '15 days'
                : process.env.AUTH_TOKEN_DEFAULT_TTL as '2 hours'
        })

        return token
    }

    // ------------------------------------------------------------------------

    /**
     * 
     * @param {string} token - Token payload
     * @returns {jwt.JwtPayload | null} - Payload data or `null` case
     * token is invalid
     */
    public static verify(token: string): jwt.JwtPayload | null {
        try {
            return jwt.verify(token, AppCache.jwtPublicKey) as (
                jwt.JwtPayload |
                null
            )
        }

        catch (error) {
            if (
                error instanceof jwt.JsonWebTokenError ||
                error instanceof jwt.TokenExpiredError
            )
                return null

            throw error
        }
    }
}

export default JWT