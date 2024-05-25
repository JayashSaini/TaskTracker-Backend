import { body } from "express-validator";
import validate from "./validate.js";

const email = () =>
  body("email")
    .isString()
    .withMessage("email must be defined of type string")
    .notEmpty()
    .withMessage("email cannot be empty")
    .isEmail()
    .withMessage("email must be a valid email");

const username = () =>
  body("username")
    .isString()
    .withMessage("username must be defined of type string")
    .notEmpty()
    .withMessage("username cannot be empty")
    .matches(/^\S*$/)
    .withMessage("username should not contain spaces")
    .isLowercase()
    .withMessage("username must be in lowercase")
    .matches(/^[a-z0-9]*$/)
    .withMessage("username should only contain alphanumeric characters")
    .isLength({ min: 4 })
    .withMessage("username must be at least 4 characters long");

const password = (field: string) =>
  body(field)
    .isString()
    .withMessage(`${field} must be defined of type string`)
    .matches(/^\S*$/)
    .withMessage(`${field} should not contain spaces`)
    .isLength({ min: 8 })
    .withMessage(`${field} must be at least 8 characters long`);

const registerUserValidator = validate([
  email(),
  username(),
  password("password"),
]);

const loginUserValidator = validate([username(), password("password")]);

const changePasswordUserValidator = validate([
  password("oldPassword"),
  password("newPassword"),
]);

export {
  registerUserValidator,
  loginUserValidator,
  changePasswordUserValidator,
};
