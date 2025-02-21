import Log from "@/utils/Log";
import Str from "@/utils/Str";
import AppURL from "@/utils/AppURL";
import AppDate from "@/utils/AppDate";
import AppCache from "@/utils/AppCache";

class AppGlobalContext {
    constructor() {
        this.defineLog()
    }

    private defineLog() {
        globalThis.Log = Log
        globalThis.Str = Str
        globalThis.AppURL = AppURL
        globalThis.AppDate = AppDate
        globalThis.AppCache = AppCache
    }
}

export default new AppGlobalContext