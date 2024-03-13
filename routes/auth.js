import express from "express";
import validateBody from "../middlewares/validateBody.js";
import { loginSchema, signupSchema } from "../models/user.js";
import {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatars,
} from "../controllers/auth.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(signupSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);
authRouter.patch("/", authenticate, updateSubscription);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatars
);
export default authRouter;
