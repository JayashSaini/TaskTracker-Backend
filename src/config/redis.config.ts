import { Redis } from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST, // Redis server hostname
  port: Number(process.env.REDIS_PORT), // Redis server port
  password: process.env.REDIS_PASSWORD, // Redis password
  db: 0, // Default DB number
});

// Event listeners for connection events

// Function to test the connection
const startRedis = async () => {
  try {
    redis.on("connect", () => {
      console.log("\n💡 Redis connected successfully");
    });

    redis.on("error", (err: any) => {
      console.error("Redis connection Error:", err);
      process.exit(1);
    });

    await redis.set("testKey", "testValue");
    await redis.get("testKey");
    await redis.del("testKey");
  } catch (err) {
    console.error("Error during Redis test:", err);
    process.exit(1);
  }
};

export { startRedis, redis };
