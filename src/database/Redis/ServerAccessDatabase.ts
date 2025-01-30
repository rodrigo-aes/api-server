import Redis from "./Redis";

class ServerAccessDatabase extends Redis {
    constructor() {
        super(process.env.REDIS_SERVER_ACCESS as string)
    }
}

export default new ServerAccessDatabase()