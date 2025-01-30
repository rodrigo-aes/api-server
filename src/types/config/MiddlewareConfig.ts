import type Middleware from "@/middlewares/Middleware"

export type MiddewaresConfig = {
    global: (new (...args: any[]) => Middleware)[]
}