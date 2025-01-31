import Log from "@/utils/Log";
import Str from "@/utils/Str";
import AppURL from "@/utils/URL";

class AppGlobalContext {
    constructor() {
        this.defineLog()
    }

    private defineLog() {
        globalThis.Log = Log
        globalThis.Str = Str
        globalThis.AppURL = AppURL
    }
}

export default new AppGlobalContext