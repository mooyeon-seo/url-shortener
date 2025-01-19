// lib/redis.ts
import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined in environment variables');
}

const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => {
  console.log('✅ Redis Connected Successfully');
});

redis.on('error', (error) => {
  console.error(`❌ Failed to connect to Redis server: ${error.message}`);
});

export default redis;
