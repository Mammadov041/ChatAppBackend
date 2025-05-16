import { io } from "socket.io-client";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { decrypt } from "./utils/encryptMessageFunctions.js";
import { firstFunction } from "./utils/consoleFunctions.js";

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const socket = io("http://localhost:3000");

socket.on("receive_private_message", (from, message) => {
  const decrypted = decrypt(message);
  console.log(`\n${from} : ${decrypted}`);
});

socket.on("receive_group_message", (from, message) => {
  const decrypted = decrypt(message);
  console.log(`\n${from}: ${decrypted}`);
});

await connectDB();
firstFunction(socket);
