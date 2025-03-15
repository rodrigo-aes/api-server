import type { Request, Response, NextFunction } from "express"
import type Auth from "@/utils/Auth"

export type RequestContextMap = {
    req: Request
    res: Response
    next: NextFunction
    Auth: Auth | null
    skip: string[]
}