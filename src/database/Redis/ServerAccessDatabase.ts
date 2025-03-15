import Redis from "./Redis";

import redisConfig from "@/config/redis"

class ServerAccessDatabase extends Redis {
    constructor() {
        super(redisConfig.serverAccessDatabase.index)
    }
}

export default new ServerAccessDatabase