import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const register = asyncHandler(async (req, res) => {
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

  const user = await User.create({ username, password, email });

  if (!user) {
    throw new ApiError(400, "User not created");
  }
  return res.status(200);
});

export { register };
