import { Router } from "express";
import {
  register,
  login,
  logout,
  getAllUsers,
  getSelf,
  getUserById,
  updatePassword,
} from "../controllers/user.controllers.js";
import {
  registerUserValidator,
  loginUserValidator,
  changePasswordUserValidator,
} from "../validators/user.validate.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/").post(registerUserValidator, register).get(getAllUsers);
router.route("/login").post(loginUserValidator, login);

// secure routes
router.use(verifyJWT);
router.route("/logout").post(logout);
router.route("/self").get(getSelf);
router.route("/:userId").get(getUserById);

router
  .route("/change-password")
  .patch(changePasswordUserValidator, updatePassword);

export default router;
