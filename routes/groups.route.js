import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  joinTheGroup,
} from "../controllers/group.controller.js";

import express from "express";

const router = express.Router();

// Route for adding a new group
router.post("/add", createGroup);

// Route for getting all groups from db
router.get("/", getGroups);

// Rotue for getting group by special id
router.get("/group/:id", getGroupById);

// Route for editing group
router.put("/edit/:id", updateGroup);

// Route for deleting the group
router.delete("/delete/:id", deleteGroup);

// Route for joining (current user) to the group
router.post("/join/:id", joinTheGroup);

export default router;
