import type Model from "@/models/Model"
import type Signature from "@/utils/Signature"

declare global {
    namespace Express {
        interface Request {
            targets: {
                [key: string]: Model
            }

            validated: {
                [key: string]: any
            }

            signature?: Signature
        }
    }
}