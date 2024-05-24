import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Todo from "../models/todo.models.js";

const createTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.create({
    title: req.body.title,
    description: req.body.description,
    isCompleted: req.body.isCompleted,
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

  const todo = await Todo.findByPk(todoId);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo found successfully", true));
});

const getAllTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.findAll();

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

  const todo = await Todo.findByPk(todoId);

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

  const todo = await Todo.findByPk(todoId);

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

export { createTodo, getTodoById, getAllTodos, updateTodo, deleteTodoById };
