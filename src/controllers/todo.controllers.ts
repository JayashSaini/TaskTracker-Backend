import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Todo from "../models/mongodb/todo.models.js";
import { redis } from "../config/redis.config.js";

interface Todo {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const createTodo = asyncHandler(async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    isCompleted: req.body.isCompleted,
    userId: req.user?.id,
  });

  await todo.save();

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
  const todo = await Todo.findById(todoId);

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
  const cachedTodos = await redis.get(`todos:${req.user?._id}`);
  if (cachedTodos) {
    const todos = JSON.parse(cachedTodos);
    return res
      .status(200)
      .json(new ApiResponse(200, todos, "Todos found in cache", true));
  }

  // If todos are not cached, fetch them from the database
  const todos = await Todo.find({ userId: req.user?._id });

  // Cache the fetched todos in Redis with expiry of 60 seconds
  await redis.set(`todos:${req.user?._id}`, JSON.stringify(todos), "EX", 60);

  // Return the fetched todos
  return res
    .status(200)
    .json(new ApiResponse(200, todos, "Todos found successfully", true));
});

const updateTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { title, description } = req.body;

  if (!(title || description)) {
    throw new ApiError(400, "At least one of title or description is required");
  }

  const todo = await Todo.findOne({
    userId: req.user?._id,
    _id: todoId,
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const updateData: any = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;

  const updatedTodo = await Todo.findByIdAndUpdate(
    todo._id,
    {
      $set: updateData,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTodo, "Todo updated successfully", true));
});

const deleteTodoById = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  const todo = await Todo.findOneAndDelete({
    userId: req.user?._id,
    _id: todoId,
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { todo }, "Todo deleted successfully", true));
});

const deleteAllTodos = asyncHandler(async (req, res) => {
  const deletedTodos = await Todo.deleteMany({
    userId: req.user?._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedTodos }, "Todos deleted successfully", true)
    );
});

const toggleTodoIsCompleted = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  const todo = await Todo.findOne({
    _id: todoId,
    userId: req.user?._id,
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    todo._id,
    {
      $set: {
        isCompleted: !todo.isCompleted,
      },
    },
    {
      new: true,
    }
  );

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
