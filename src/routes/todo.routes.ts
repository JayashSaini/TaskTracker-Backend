import { Router } from "express";
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodoById,
  deleteAllTodos,
  toggleTodoIsCompleted,
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

router.route("/toggle/:todoId").patch(toggleTodoIsCompleted);

export default router;
