import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import sequelize from "sequelize";

const errorHandler = function (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) {
  let error: ApiError | any = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error instanceof sequelize.Error ? 400 : 500);
    const message = error.message || "Something went wrong";

    error = new ApiError(statusCode, message, {}, false);
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class

  const response: any = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "production" ? {} : { stack: error.stack }),
  };

  // Send error response
  return res.status(error?.statusCode || 500).json(response);
};

export { errorHandler };
