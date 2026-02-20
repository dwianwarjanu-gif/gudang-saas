const Redis = require('ioredis');

let redis = null;

// ===== INIT REDIS =====
if (process.env.NODE_ENV === 'production') {
  const Redis = require('ioredis');

  session = new Redis({
    host: '127.0.0.1',
    port: 6379
  });

  session.on('connect', () => {
    console.log('Redis connected');
  });

  session.on('error', (err) => {
    console.error('Redis error:', err);
  });
} else {
  console.log('Redis disabled (development mode)');
}
// ===== SESSION HELPER =====
const session = {
  async set(key, value, ttlSeconds) {
    if (!redis) return;
    await redis.set(key, value, 'EX', ttlSeconds);
  },

  async get(key) {
    if (!redis) return null;
    return await redis.get(key);
  },

  async del(key) {
    if (!redis) return;
    await redis.del(key);
  }
};

module.exports = {
  session
};