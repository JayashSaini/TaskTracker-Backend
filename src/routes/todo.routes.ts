import { Router } from "express";
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
} from "../controllers/todo.controllers.js";
import {
  createTodoValidator,
  updateTodoValidator,
} from "../validators/todo.validate.js";

const router = Router();

router.route("/").get(getAllTodos).post(createTodoValidator, createTodo);

router
  .route("/:todoId")
  .get(getTodoById)
  .patch(updateTodoValidator, updateTodo);

export default router;
