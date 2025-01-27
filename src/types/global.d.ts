import LogClass from "../utils/Log";

type Log = typeof LogClass

declare global {
    var Log: Log;
}

export {}