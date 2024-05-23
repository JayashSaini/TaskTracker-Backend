import { body, param } from "express-validator";
import validate from "./validate.js";

const title = () =>
  body("title")
    .isString()
    .withMessage("Title must be defined of type string.")
    .trim()
    .notEmpty()
    .withMessage("Todo title is required and cannot be empty.");

const description = () =>
  body("description")
    .isString()
    .withMessage("Todo Desciption must be of type string.");

const createTodoValidator = validate([title(), description()]);
const updateTodoValidator = validate([title(), description()]);

export { createTodoValidator, updateTodoValidator };
