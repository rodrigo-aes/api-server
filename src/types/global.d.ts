import type {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction as ExpressNextFunction
} from "express";

import type LogClass from "@/utils/Log"
import type StrClass from "@/utils/Str"
import type AppURLClass from '@/utils/URL'

type Log = typeof LogClass
type Str = typeof StrClass
type AppURL = typeof AppURLClass


declare global {
    type NextFunction = ExpressNextFunction

    // Utils ------------------------------------------------------------------
    var Log: Log
    var Str: Str
    var AppURL: AppURL
}

export { }