import { Router } from "express";
import { createTodo } from "../controllers/todo.controllers.js";
import { createTodoValidator } from "../validators/todo.validate.js";

const router = Router();

router.route("/").post(createTodoValidator, createTodo);

export default router;
