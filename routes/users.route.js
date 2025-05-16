import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// Route for getting all users
router.get("/", getUsers);

// Route for getting user by id
router.get("/user/:id", getUserById);

// Route for editing user
router.put("/edit/:id", updateUser);

// Route for deleting the user
router.delete("/delete/:id", deleteUser);

export default router;
