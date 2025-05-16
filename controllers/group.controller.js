import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";

export const createGroup = async (req, res) => {
  try {
    const group = new Group(req.body);
    const savedGroup = await group.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find()
    .populate("groupMessages");
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
    .populate("groupMessages");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: Date.now() },
      {
        new: true,
      }
    );
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const joinTheGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if user is already in group
    const alreadyInGroup = group.members.includes(userId);
    if (alreadyInGroup) {
      return res
        .status(400)
        .json({ message: "You already joined this group." });
    }

    // Add references
    group.members.push(userId);
    user.groups.push(groupId);

    await group.save();
    await user.save();

    res.status(200).json({ message: "Successfully joined the group." });
  } catch (err) {
    console.error("Join Group Error:", err);
    res.status(500).json({ error: err.message });
  }
};
