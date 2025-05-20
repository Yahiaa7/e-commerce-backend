// Import the ioredis library to interact with the Redis database
const Redis = require('ioredis');
const { eventEmitter } = require('../utils/eventEmitter'); // EventEmitter for handling application-wide events
// Create and export a Redis client instance using an immediately invoked function expression (IIFE)
const redisClient = (() => {
    // Initialize the Redis client with configuration options
    const redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost', // Redis server hostname (configurable via environment variable)
        port: process.env.REDIS_PORT || 6379,        // Redis server port (configurable via environment variable)
        password: process.env.REDIS_PASSWORD || undefined, // Password for secure access (optional)
        db: process.env.REDIS_DB_INDEX || 0,        // Database index for JWT blacklist (default is 0)
        keyPrefix: process.env.REDIS_KEY_PREFIX || 'JWT_', // Prefix for keys to avoid collisions
        enableReadyCheck: true, // Ensures the client waits for the Redis server to be ready before processing commands
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000); // Retry delay increases with each attempt
            return delay; // Return delay in milliseconds for the next retry attempt
        }
    });
    return redis;
})();

// Graceful shutdown handler for redis resources
eventEmitter.on('redisShutdown', async ({ resolve, reject }) => {
    // Shutdown Redis client
    try {
        console.log('Closing Redis client...');
        await redisClient.quit();
        console.log('Redis client closed.');
        resolve();
    } catch (error) {
        console.error('Error while closing Redis client:', error.message);
        reject(error);
    }
});

exports.redisClient = redisClient;