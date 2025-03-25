import type Model from "@/models/Model"
import type Signature from "@/utils/Signature"
import File from "@/utils/File"

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

            uploads?: File[] | { [key: string]: File[] }
            upload?: File
        }
    }
}