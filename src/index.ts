import { app, startApp } from "./app.js";
import connectToDatabase from "./db/index.js";
import { startRedis } from "./config/redis.config.js";

(async () => {
  // connect to redis database
  await startRedis();

  // connect to my sql database
  await connectToDatabase();

  // running App
  startApp();

  app.listen(Number(process.env.PORT), () => {
    console.log(`🌍 Server is running on port ${process.env.PORT}`);
  });
})();
