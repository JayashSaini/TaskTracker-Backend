import express from "express";
const app = express();

function startApp() {
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
}

export { app, startApp };
