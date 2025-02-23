import type Model from "@/models/Model"

declare global {
    namespace Express {
        interface Request {
            targets: {
                [key: string]: Model
            }
        }
    }
}