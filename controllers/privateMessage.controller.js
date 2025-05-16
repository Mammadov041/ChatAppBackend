import { PrivateMessage } from "../models/privateMessage.model.js";

export const createPrivateMessage = async (req, res) => {
  try {
    const message = new PrivateMessage({
      ...req.body,
      receiver: req.params.id,
    });
    const saved = await message.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const messages = await PrivateMessage.find()
      .populate("sender")
      .populate("receiver");
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPrivateMessageById = async (req, res) => {
  try {
    const message = await PrivateMessage.findById(req.params.id)
      .populate("sender")
      .populate("receiver");
    if (!message) return res.status(404).json({ message: "Not found" });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePrivateMessage = async (req, res) => {
  try {
    const message = await PrivateMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
