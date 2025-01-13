// Import the ioredis library to interact with the Redis database
const Redis = require('ioredis');

// Create and export a Redis client instance using an immediately invoked function expression (IIFE)
module.exports.redisClient = (() => {
    // Initialize the Redis client with configuration options
    const redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost', // Redis server hostname (configurable via environment variable)
        port: process.env.REDIS_PORT || 6379,        // Redis server port (configurable via environment variable)
        enableReadyCheck: true, // Ensures the client waits for the Redis server to be ready before processing commands
        settings: { save: process.env.REDIS_SAVE_SETTINGS || '10 1' } // Example setting to configure Redis persistence
    });

    return redis;
})();
