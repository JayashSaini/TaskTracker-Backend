import { Router } from "express";
import { register } from "../controllers/user.controllers.js";
import { registerUserValidator } from "../validators/user.validate.js";
const router = Router();

router.route("/").post(registerUserValidator, register);

export default router;
