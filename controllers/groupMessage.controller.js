import { Group } from "../models/group.model.js";
import { GroupMessage } from "../models/groupMessage.model.js";

export const createGroupMessage = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    const msg = new GroupMessage({
      ...req.body,
      group: req.params.id,
    });
    const savedMsg = await msg.save();
    group.groupMessages.push(savedMsg._id);
    await group.save();
    res.status(201).json(savedMsg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const messages = await GroupMessage.find()
      .populate("sender")
      .populate("group");
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGroupMessageById = async (req, res) => {
  try {
    const message = await GroupMessage.findById(req.params.id)
      .populate("sender")
      .populate("group");
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGroupMessage = async (req, res) => {
  try {
    const message = await GroupMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
