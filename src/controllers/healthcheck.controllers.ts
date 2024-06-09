import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (_, res) => {
  res.status(200).json(new ApiResponse(200, null, "OK", true));
});

export { healthcheck };
