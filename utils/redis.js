const Redis = require('ioredis');

module.exports.redisClient = (() => {
    const redis = new Redis({
        host: 'localhost',
        port: 6379,
        enableReadyCheck: true,
        settings: { save: '10 1' },
    });
    return redis;
})();