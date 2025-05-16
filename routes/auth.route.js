import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

// Route for refreshing the token
router.post("/refresh", refreshToken);

// Route for logging out the user
router.post("/logout", logout);

export default router;
