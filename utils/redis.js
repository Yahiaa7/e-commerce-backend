const Redis = require('ioredis');

module.exports.redisClient = () => {
    const redis = new Redis({
        host: 'localhost',
        port: 6379,
        enableReadyCheck: true,
        settings: { save: '60 1' },
    });
    return redis;
};