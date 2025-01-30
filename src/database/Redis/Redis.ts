import { Redis as IORedis } from "ioredis"

export default class Redis extends IORedis {
    constructor(db: string) {
        super({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT as string),
            password: process.env.REDIS_PASS,
            db: parseInt(db)
        })
    }
}