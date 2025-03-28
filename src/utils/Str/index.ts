import { v4 } from "uuid";
import RandExp from "randexp";

import {
    MaskValue,
    UnmaskValue,
    type MaskValueProps,
    type UnmaskValueProps
} from "@/utils/Mask";

// Utils
import Hash from "@/utils/Hash";

export default class Str extends String {
    constructor(value?: any) {
        super(value);
        Object.setPrototypeOf(this, Str.prototype);
    }

    // Static Methods =========================================================
    /**
     * Generate a UUID V4
     */
    public static UUIDV4() {
        return v4()
    }

    // ------------------------------------------------------------------------

    /**
     * Generate a hash string to compare with the original string
     * @param {string} string - Original string 
     * @returns {string} - Hashed string
     */
    public static hash(string: string) {
        return Hash.make(string)
    }

    // ------------------------------------------------------------------------

    /**
     * Generate a radom string with a length
     * @param {number} length - String length 
     * @returns {string} - Random string
     */
    public static random(length: number): string {
        const regex = new RegExp(`^[a-zA-Z0-9]{${length}}$`)
        return new RandExp(regex).gen()
    }

    // ------------------------------------------------------------------------

    /**
     * Apply a mask to a string value
     */
    public static mask(value: string, config: MaskValueProps) {
        return MaskValue(value, config)
    }

    // ------------------------------------------------------------------------

    /**
     * Revert a mask apllied to a string value
     */
    public static unmask(value: string, config: UnmaskValueProps) {
        return UnmaskValue(value, config)
    }

    // ------------------------------------------------------------------------

    /**
     * Dedent de the content string
     * @param {string} content
     */
    public static dedent(content: string) {
        const lines = content.split("\n");
        const indentLength = Math.min(
            ...lines.filter(line => line.trim().length > 0)
                .map(line => line.match(/^\s*/)?.[0]?.length || 0)
        );
        return lines.map(line => line.slice(indentLength)).join("\n").trim();
    }
}

