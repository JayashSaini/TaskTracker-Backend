import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import { app, startApp } from "./app.js";

(() => {
  // running App
  startApp();

  app.listen(process.env.PORT, () => {
    console.log(`🌍 Server is running on port ${process.env.PORT}`);
  });
})();
