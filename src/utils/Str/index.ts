import { v4 } from "uuid";

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

