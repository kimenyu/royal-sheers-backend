import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));

// Function to connect to Redis
const connectRedis = async () => {
    await client.connect();
    console.log('Connected to Redis');
};

export { client, connectRedis };