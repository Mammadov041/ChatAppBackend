import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Group Name is required"],
    minlength: [6, "Group Name must be at least 6 characters"],
    maxlength: [30, "Group Name must be less than 30 characthers"],
    unique: [true, "This Group already exsists"],
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  groupMessages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupMessage",
    },
  ],
});

export const Group = mongoose.model("Group", groupSchema);
