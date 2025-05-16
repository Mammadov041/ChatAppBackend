import express from "express";

import {
  createGroupMessage,
  getGroupMessages,
  getGroupMessageById,
  deleteGroupMessage,
} from "../controllers/groupMessage.controller.js";

const router = express.Router();

// Route for sending group message to the group
router.post("/send/:id", createGroupMessage);

// Route for getting all group messages
router.get("/", getGroupMessages);

// Route for getting group message by id
router.get("/group-message/:id", getGroupMessageById);

// Route for deleting group message
router.delete("/delete/:id", deleteGroupMessage);

export default router;
