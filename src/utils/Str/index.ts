import { v4 } from "uuid";

export default class Str extends String {
    constructor(value?: any) {
        super(value);
        Object.setPrototypeOf(this, Str.prototype);
    }

    public static UUIDV4() {
        return v4()
    }
}

