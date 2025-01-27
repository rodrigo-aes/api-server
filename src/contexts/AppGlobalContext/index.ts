import Log from "@/utils/Log";

class AppGlobalContext {
    constructor () {
        this.defineLog()
    }

    private defineLog () {
        globalThis.Log = Log;
    }
}

export default AppGlobalContext