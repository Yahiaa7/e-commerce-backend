const { redisClient } = require('./redis.conf'); // Import the initialized Redis client

/**
 * Sets up Redis configuration and validates AOF persistence.
 * Emits an error event if the setup fails.
 *
 * @param {EventEmitter} emitter - The global event emitter for handling errors.
 */
exports.redisSetup = async (emitter) => {
    try {
        // Check the status of the Append-Only File (AOF) persistence
        const appendOnlyStatus = await redisClient.config('GET', 'appendonly');
        
        if (appendOnlyStatus.appendonly === 'no') {
            console.warn(
                'Redis AOF persistence is not enabled. Blacklisted tokens may not survive restarts.'
            );
        } else {
            console.log('Redis AOF persistence is enabled.');
        }
    } catch (error) {
        // Emit an error event to the server's event emitter
        emitter.emit('serverShutdown', {
            source: 'RedisSetup',
            message: 'Error during Redis setup',
            details: error.message,
        });
    }
};
