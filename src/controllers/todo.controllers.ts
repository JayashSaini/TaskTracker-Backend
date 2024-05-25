import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Todo from "../models/todo.models.js";
import { redis } from "../config/redis.config.js";

interface Todo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const createTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.create({
    title: req.body.title,
    description: req.body.description,
    isCompleted: req.body.isCompleted,
    userId: req.user?.id,
  });
  if (!todo) {
    throw new ApiError(400, "Todo not created");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Todo created successfully", true));
});

const getTodoById = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  // Check if the todo is cached in Redis
  const cachedTodo = await redis.get(`todo:${todoId}`);
  if (cachedTodo) {
    const todo = JSON.parse(cachedTodo);
    return res
      .status(200)
      .json(new ApiResponse(200, todo, "Todo found in cache", true));
  }

  // If the todo is not cached, fetch it from the database
  const todo = await Todo.findByPk(todoId);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  // Cache the fetched todo in Redis
  await redis.set(`todo:${todoId}`, JSON.stringify(todo), "EX", 60);

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo found successfully", true));
});

const getAllTodos = asyncHandler(async (req, res) => {
  // Check if todos are cached in Redis
  const cachedTodos = await redis.get(`todos:${req.user?.id}`);
  if (cachedTodos) {
    const todos = JSON.parse(cachedTodos);
    return res
      .status(200)
      .json(new ApiResponse(200, todos, "Todos found in cache", true));
  }

  // If todos are not cached, fetch them from the database
  const todos = await Todo.findAll({ where: { userId: req.user?.id } });

  // Cache the fetched todos in Redis with expiry of 60 seconds
  await redis.set(`todos:${req.user?.id}`, JSON.stringify(todos), "EX", 60);

  // Return the fetched todos
  return res
    .status(200)
    .json(new ApiResponse(200, todos, "Todos found successfully", true));
});

const updateTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { title, description } = req.body;

  if (!(title || description)) {
    throw new ApiError(404, "Atleast one of title, description is required");
  }

  const todo = await Todo.findOne({
    where: {
      userId: req.user?.id,
      id: todoId,
    },
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  interface updateTodoData {
    title?: string;
    description?: string;
  }

  let data: updateTodoData = {};
  if (title) data.title = title;
  if (description) data.description = description;

  const updatedTodo = await todo.update({
    title,
    description,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTodo, "Todo updated successfully", true));
});

const deleteTodoById = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  const todo = await Todo.findOne({
    where: {
      userId: req.user?.id,
      id: todoId,
    },
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const deletedTodo = await todo.destroy();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedTodo }, "Todo Deleted successfully", true)
    );
});

const deleteAllTodos = asyncHandler(async (req, res) => {
  const deletedTodos = await Todo.destroy({
    where: {
      userId: req.user?.id,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedTodos }, "Todos Deleted successfully", true)
    );
});

const toggleTodoIsCompleted = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  const todo: Todo | any = await Todo.findOne({
    where: {
      id: todoId,
      userId: req.user?.id,
    },
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const updatedTodo = await todo.update({
    isCompleted: !todo.isCompleted,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTodo, "Todo updated successfully", true));
});

export {
  createTodo,
  getTodoById,
  getAllTodos,
  updateTodo,
  deleteTodoById,
  deleteAllTodos,
  toggleTodoIsCompleted,
};
