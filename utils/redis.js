import { createClient } from 'redis';
import { promisify } from 'util';

// Class to define methods for commonly used Redis commands
class RedisClient {
    constructor() {
        this.client = createClient();
        
        // Handling connection errors
        this.client.on('error', (error) => {
            console.log(`Redis client not connected to server: ${error}`);
        });
    }

    // Check if Redis client is connected
    isAlive() {
        return this.client.connected;  // Directly return the connection status
    }

    // Get value for a given key from the Redis server
    async get(key) {
        const redisGet = promisify(this.client.get).bind(this.client);
        const value = await redisGet(key);
        return value;
    }

    // Set key-value pair in Redis with expiration time
    async set(key, value, time) {
        const redisSetex = promisify(this.client.setex).bind(this.client);
        await redisSetex(key, time, value);  // Use `setex` to set the value with expiration
    }

    // Delete key-value pair from Redis server
    async del(key) {
        const redisDel = promisify(this.client.del).bind(this.client);
        await redisDel(key);
    }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
