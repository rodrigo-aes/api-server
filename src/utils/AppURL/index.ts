import { URL } from "url"
import Signature, { type MakeMap } from "@/utils/Signature"

import RequestContext from "@/contexts/RequestContext"

export default class AppURL extends URL {
    private queryParamLen = '?signature='.length
    public signature: string | null

    constructor(
        input: string = RequestContext.req.originalUrl,
        base: string =
            `${RequestContext.req.protocol}://${RequestContext.req.get("host")}`
    ) {
        super(input, base)

        this.signature = this.searchParams.get('signature')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Sign URL
     * 
     * @param {MakeMap} map - Signature options map 
     * @returns {this} - `this`
     */
    public async sign(
        map: MakeMap = { length: 255 }
    ): Promise<this> {
        length -= (this.href.length + this.queryParamLen)
        const signature = await Signature.make({ length, ...map })

        this.searchParams.append('signature', signature.signature)

        return this
    }

    // Static Methods =========================================================
    /**
     * Verify if the current URL has a valid signature 
     * 
     * @returns 
     */
    public static async hasValidSignature(): Promise<Signature | null> {
        const url = new AppURL
        const signature = url.signature
            ? await Signature.verify(url.signature)
            : null

        return signature
    }
}