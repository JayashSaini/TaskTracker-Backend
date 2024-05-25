import { asyncHandler } from "../utils/asyncHandler.js";
import User, { UserInstance } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const generateAccessToken = async (userId: any) => {
  try {
    const user: UserInstance | null = await User.findByPk(userId);

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
    throw new ApiError(400, "Something went while generating access token");
  }
};

const options = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  httpOnly: true,
};

const register = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body;

  const existingUserName = await User.findOne({
    where: { username: username },
  });
  if (existingUserName) {
    throw new ApiError(400, "Username already exists");
  }

  const existingEmail = await User.findOne({
    where: { email: email },
  });
  if (existingEmail) {
    throw new ApiError(400, "Email already exists");
  }

  const user: UserInstance = await User.create({ username, password, email });

  if (!user) {
    throw new ApiError(400, "User not created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User registered successfully", true));
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: { username: username },
  });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  const accessToken = await generateAccessToken(user?.id);

  if (!accessToken) {
    throw new ApiError(400, "Something went while generating access token");
  }

  const loginUser = await User.findByPk(user?.id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, loginUser, "User logged in successfully", true));
});

const logout = asyncHandler(async (req, res) => {
  const user: UserInstance | null = await User.findByPk(req.user?.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.accessToken = "";
  await user.save();

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully", true));
});

const getSelf = asyncHandler(async (req, res) => {
  const user: UserInstance | null = await User.findByPk(req.user?.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully", true));
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user: UserInstance | null = await User.findByPk(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully", true));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully", true));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user: UserInstance | null = await User.findByPk(req?.user?.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  user.password = newPassword;

  await user.save();

  const updatePassword = await User.findByPk(user.id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatePassword,
        "User password updated successfully",
        true
      )
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
