import type Middleware from "@/middlewares/Middleware"

export type MiddewareConfig = {
    global: (new (...args: any[]) => Middleware)[]
}