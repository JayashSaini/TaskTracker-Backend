import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.models.js";
import { NextFunction, Response, Request } from "express";

const verifyJWT = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, " Unauthorized request");
    }

    try {
      const decodedToken: any = jwt.verify(
        token,
        process.env.ACCESSTOKEN_SECRET
      );

      const user = await User.findByPk(decodedToken?.id, {
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      req.user = user;
      next();
    } catch (error: any) {
      throw new ApiError(400, error?.message || "Invalid token");
    }
  }
);

export { verifyJWT };
