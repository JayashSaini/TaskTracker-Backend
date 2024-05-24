import { Router } from "express";
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodoById,
  deleteAllTodos,
} from "../controllers/todo.controllers.js";
import {
  createTodoValidator,
  updateTodoValidator,
} from "../validators/todo.validate.js";

const router = Router();

router
  .route("/")
  .get(getAllTodos)
  .post(createTodoValidator, createTodo)
  .delete(deleteAllTodos);

router
  .route("/:todoId")
  .get(getTodoById)
  .patch(updateTodoValidator, updateTodo)
  .delete(deleteTodoById);

export default router;
