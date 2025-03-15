import Redis from "./Redis";

import redisConfig from "@/config/redis";

class SignatureDatabase extends Redis {
    constructor() {
        super(redisConfig.signatureDatabase.index)
    }
}

export default new SignatureDatabase