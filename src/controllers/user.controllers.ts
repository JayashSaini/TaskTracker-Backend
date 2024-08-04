import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/mongodb/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const generateAccessToken = async (userId: any) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESSTOKEN_SECRET,
      {
        expiresIn: process.env.ACCESSTOKEN_EXPIRY,
      }
    );

    user.accessToken = accessToken;
    await user.save();

    return accessToken;
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while generating access token"
    );
  }
};

const options = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  httpOnly: true,
};

const register = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body;

  const existingUserName = await User.findOne({ username });
  if (existingUserName) {
    throw new ApiError(400, "Username already exists");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Email already exists");
  }

  const user = new User({ username, password, email });
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User registered successfully", true));
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  const accessToken = await generateAccessToken(user._id);

  if (!accessToken) {
    throw new ApiError(
      400,
      "Something went wrong while generating access token"
    );
  }

  return res
    .status(200)
    .cookie("token", accessToken, options)
    .json(new ApiResponse(200, user, "User logged in successfully", true));
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.accessToken = "";
  await user.save();

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, {}, "User logged out successfully", true));
});

const getSelf = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully", true));
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully", true));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully", true));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req?.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  user.password = newPassword;

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User password updated successfully", true)
    );
});

export {
  register,
  login,
  logout,
  getSelf,
  getAllUsers,
  getUserById,
  updatePassword,
};
