import { app, startApp } from "./app.js";
import { startRedis } from "./config/redis.config.js";
import connectDB from "./db/mongodb.js";
// import connectToDatabase from "./db/mysql.js";

(async () => {
  // connect to redis database
  await startRedis();

  // connect to mongodb database
  await connectDB();

  // connect to my sql database
  // await connectToDatabase();

  // running App
  startApp();

  app.listen(Number(process.env.PORT), () => {
    console.log(`🌍 Server is running on port ${process.env.PORT}`);
  });
})();
