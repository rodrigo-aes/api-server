import type {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction as ExpressNextFunction
} from "express";

import type LogClass from "@/utils/Log";

type Log = typeof LogClass

declare global {
    type NextFunction = ExpressNextFunction

    // Utils ------------------------------------------------------------------
    var Log: Log;
}

export { }