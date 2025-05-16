import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Private message text is required"],
    trim: true,
    minlength: [1, "Private message must be at least 1 character"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sender is required"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Receiver is required"],
  },
});

export const PrivateMessage = mongoose.model(
  "PrivateMessage",
  privateMessageSchema
);
