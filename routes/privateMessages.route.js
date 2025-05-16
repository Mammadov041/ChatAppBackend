import express from "express";
import {
  createPrivateMessage,
  getPrivateMessages,
  getPrivateMessageById,
  deletePrivateMessage,
} from "../controllers/privateMessage.controller.js";

const router = express.Router();

// Route for adding a new private message
router.post("/send/:id", createPrivateMessage);

// Route for getting private messages
router.get("/", getPrivateMessages);

// Route for getting private message by id
router.get("/private-message/:id", getPrivateMessageById);

// Route for deleting the private message
router.delete("/delete/:id", deletePrivateMessage);

export default router;
