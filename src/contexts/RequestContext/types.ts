import type { Request, Response } from "express"
import type Auth from "@/utils/Auth"

export type RequestContextMap = {
    req: Request
    res: Response
    Auth: Auth | null
    skip: string[]
}