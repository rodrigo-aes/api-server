import {
    Redis as IORedis,
    type RedisOptions
} from "ioredis"

export default class Redis extends IORedis {
    constructor(db: number | string, options?: RedisOptions) {
        super({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT as string),
            password: process.env.REDIS_PASS,
            db: typeof db === 'number' ? db : parseInt(db),
            lazyConnect: true,
            ...options
        })
    }
}