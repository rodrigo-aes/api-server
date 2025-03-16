import { SignatureDatabase } from "@/database/Redis"
import RequestContext from "@/contexts/RequestContext"

// Types
import type { MakeMap } from "./types"

class Signature {
    constructor(
        public signature: string,
        public data: any
    ) {
        this.initHandle()
    }

    // Instance Methods =======================================================
    /**
     * Expire the signature in database
     */
    public async expire(): Promise<void> {
        await SignatureDatabase.del(this.signature)
    }

    // ------------------------------------------------------------------------

    /**
     * Expire the siganture in database on request close 
     */
    public expireOnClose(): void {
        RequestContext.req.on('close',
            async () => await this.expire()
        )
    }

    // ------------------------------------------------------------------------

    public expireCaseStatus(status: number | number[]) {
        RequestContext.req.on('close',
            async () => {
                const shoulExpire = typeof status === 'number'
                    ? RequestContext.req.statusCode === status
                    : status.includes(RequestContext.req.statusCode as number)

                if (shoulExpire) await this.expire()
            }
        )
    }

    // Privates ---------------------------------------------------------------
    public async initHandle(): Promise<void> {
        if (this.data.uniqueUse) this.expireOnClose()
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Make a new signature
     * 
     * @param {MakeMap} makeMap - Signature init map
     * @returns {Signature} - `Signature` instance
     */
    public static async make(
        {
            data = {},
            length = 255,
            exp,
            uniqueUse = false
        }: MakeMap = {
                data: {},
                length: 255,
                exp: undefined,
                uniqueUse: false
            }
    ): Promise<Signature> {
        const signature = await this.gen(length)

        if (exp) {
            const expireAt = new AppDate().add(exp)

            await SignatureDatabase.set(
                signature,
                JSON.stringify({ ...data, uniqueUse, expireAt }),
                'EX',
                new AppDate().diff('s', expireAt)
            )
        }
        else await SignatureDatabase.set(
            signature,
            JSON.stringify({ ...data, uniqueUse }),
        )

        return new Signature(signature, data)
    }

    // ------------------------------------------------------------------------

    /**
     * Gen a new unique signature string
     *  
     * @param {number} length - Signature string length 
     * @returns {string} - Signature string
     */
    public static async gen(length: number = 255): Promise<string> {
        let signature;
        do {
            signature = Str.random(length)
        }
        while (await SignatureDatabase.get(signature))

        return signature
    }

    // ------------------------------------------------------------------------

    /**
     * Verify if is a valid existent signature
     * 
     * @param signature 
     * @returns 
     */
    public static async verify(signature: string): Promise<Signature | null> {
        const raw = await SignatureDatabase.get(signature)
        if (!raw) return null

        return new Signature(signature, JSON.parse(raw))
    }
}

export default Signature

export type {
    MakeMap
}