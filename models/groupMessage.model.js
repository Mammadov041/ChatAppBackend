import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Group message text is required"],
    trim: true,
    minlength: [1, "Group message must be at least 1 character"],
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
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: [true, "Group property required"],
  },
});

export const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);
