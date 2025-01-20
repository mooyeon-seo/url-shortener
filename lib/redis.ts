// lib/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  db: 0  // Explicitly set database index
})

redis.on('connect', () => {
  console.log('✅ Redis Connected Successfully');
});

redis.on('error', (error) => {
  console.error(`❌ Failed to connect to Redis server: ${error.message}`);
});

export default redis;
