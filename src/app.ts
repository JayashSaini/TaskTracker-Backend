import express from "express";
import { errorHandler } from "./middlewares/error.middlewares.js";
import todoRouter from "./routes/todo.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
const app = express();

function startApp() {
  app.use(
    cors({
      origin: "*",
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
  );

  app.use(
    express.json({
      limit: "50mb",
    })
  );
  app.use(
    express.urlencoded({
      limit: "50",
      extended: true,
      parameterLimit: 50000,
      type: "application/x-www-form-urlencoded",
    })
  );

  app.use("/api/v1/todo", todoRouter);
  app.use("/api/v1/user", userRouter);

  // Implemented error handling middleware
  app.use(errorHandler);
}

export { app, startApp };
