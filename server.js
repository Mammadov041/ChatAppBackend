import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";

import errorLogger from "./middleware/globalErrorHandler.js";

// Routes
import authRoute from "./routes/auth.route.js";
import groupsRoute from "./routes/groups.route.js";
import privateMessagesRoute from "./routes/privateMessages.route.js";
import groupMessagesRoute from "./routes/groupMessages.route.js";
import usersRoute from "./routes/users.route.js";

// Models
import { User } from "./models/user.model.js";

dotenv.config();

// Init
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/groups", groupsRoute);
app.use("/api/private-messages", privateMessagesRoute);
app.use("/api/group-messages", groupMessagesRoute);

app.use(errorLogger);

const socketUserMap = new Map();

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log(`🔌 Connected: ${socket.id}`);

  socket.on("register", async (username, password, callback) => {
    try {
      const url = `${process.env.LOCALHOST_URI}api/auth/register`;

      const response = await axios.post(url, { username, password });

      return callback(true);
    } catch (err) {
      console.error("❌ Error in registration:", err.message);
      return callback(false);
    }
  });

  socket.on("login", async (username, password, callback) => {
    try {
      const response = await axios.post(
        `${process.env.LOCALHOST_URI}api/auth/login`,
        { username, password }
      );

      if (response.data) {
        console.log(`User - ${username} logged in successfully`);
        const currentUser = await User.findOne({ username }).select(
          "-password"
        );
        socketUserMap.set(currentUser._id.toString(), socket.id);
        currentUser.socketId = socket.id;
        await currentUser.save();
        return callback(true, currentUser); // success
      }
      return callback(false, null); // login failed
    } catch (err) {
      console.error("❌ Error in login:", err.message);
      return callback(false, null); // error
    }
  });

  socket.on(
    "send_private_message",
    async (fromUser, toUser, message, callback) => {
      try {
        const toSocketId = socketUserMap.get(toUser._id.toString());
        if (toSocketId) {
          io.to(toSocketId).emit(
            "receive_private_message",
            fromUser.username,
            message
          );
        }
        const response = await axios.post(
          `${process.env.LOCALHOST_URI}api/private-messages/send/${toUser._id}`,
          {
            text: message,
            sender: fromUser._id,
          }
        );
        if (response.data) {
          console.log(`Private message was sent successfully`);
          return callback(true); // success
        }
        return callback(false); // sending private message failed
      } catch (err) {
        console.error("❌ Error sending private message:", err.message);
      }
    }
  );

  socket.on("create_group", async (groupName, callback) => {
    try {
      const response = await axios.post(
        `${process.env.LOCALHOST_URI}api/groups/add`,
        {
          name: groupName,
        }
      );
      if (response.data) {
        console.log(`Group created successfully`);
        return callback(true); // success
      }
      return callback(false); // room creation failed
    } catch (error) {
      console.error("❌ Error creating group:", error.message);
    }
  });

  socket.on("join_group", async (groupName) => {
    try {
      const user = await User.find({ socketId: socket.id });
      socket.join(groupName);
      console.log(`User - ${user.username} joined group ${groupName}`);
    } catch (err) {
      console.error("❌ Error joining group:", err.message);
    }
  });

  socket.on("send_group_message", async (group, message, sender, callback) => {
    try {
      io.to(group.name).emit("receive_group_message", sender.username, message);
      const response = await axios.post(
        `${process.env.LOCALHOST_URI}api/group-messages/send/${group._id}`,
        {
          text: message,
          sender: sender._id,
        }
      );
      if (response.data) {
        console.log(`Group message was sent successfully`);
        return callback(true); // success
      }
      return callback(false); // sending group message failed
    } catch (err) {
      console.error("❌ Error sending group message:", err.message);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        socketUserMap.delete(user._id.toString());
        user.socketId = null;
        await user.save();
      }
      console.log(`❌ Disconnected: ${user?.username || "unknown user"}`);
    } catch (err) {
      console.error("❌ Error during disconnect:", err.message);
    }
  });
});

// Server start
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
