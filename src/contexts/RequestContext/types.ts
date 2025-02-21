import type { Request } from "express"
import type Auth from "@/utils/Auth"

export type RequestContextMap = {
    req: Request
    Auth: Auth | null
    skip: string[]
}