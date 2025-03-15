const redisConfig = {
    serverAccessDatabase: {
        index: 0
    },

    signatureDatabase: {
        index: 1
    }
}

export default redisConfig
export type RedisConfig = typeof redisConfig