import Middleware from "@/middlewares/Middleware"
import type { Response } from "express";

import { ServerAccessDatabase } from "@/database/Redis";

export default class MaxRequestsLimit extends Middleware {
    public async handle(): Promise<void | Response> {
        const requests = await this.incrementRequestsCount()
        const limit = parseInt(
            process.env.APP_MAX_REQUESTS_PER_MINUTE as string
        )

        if (requests > limit) return this.res.status(429).json({
            error: `Too many requests. API request limit per minute: ${limit}`
        })

        return this.next()
    }

    // ========================================================================

    private async incrementRequestsCount() {
        const key = `rate:${this.req.ip}`
        const count = await ServerAccessDatabase.incr(key)

        if (count === 1) await ServerAccessDatabase.expire(key, 60);

        return count
    }
}