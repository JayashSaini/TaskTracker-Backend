import { Router } from "express";
import { createTodo, getTodoById } from "../controllers/todo.controllers.js";
import { createTodoValidator } from "../validators/todo.validate.js";

const router = Router();

router.route("/").post(createTodoValidator, createTodo);

router.route("/:todoId").get(getTodoById);

export default router;
