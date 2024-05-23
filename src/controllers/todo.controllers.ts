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

export { createTodo };
