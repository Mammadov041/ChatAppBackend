import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  socketId: {
    type: String,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [6, "Username must be at least 6 characters"],
    maxlength: [12, "Username must be less than 12 characthers"],
    trim: true,
    unique: [true, "This username already exsists"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characthers long"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

export const User = mongoose.model("User", userSchema);
