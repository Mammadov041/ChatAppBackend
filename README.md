# 🧑‍💻 Terminal Chat App - Node.js, Socket.IO, MongoDB

A command-line chat application built with **Node.js**, **Socket.IO**, and **MongoDB**. Users can register, log in, and chat in real-time via the terminal — either privately with other users or in groups. Only admins can create groups.

---

## ✨ Features

- ✅ User registration and login (with password hashing)
- 🔐 Authentication & user sessions
- 💬 Real-time private messaging
- 👥 Group chat support
- 🔒 End-to-end message encryption (custom implementation)
- 🛡️ Admin-only group creation
- 📜 Chat history is shown when entering a conversation
- 🖥️ Full terminal-based CLI experience

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **WebSocket**: Socket.IO
- **Database**: MongoDB + Mongoose
- **CLI Input**: `readline` module
- **Security**: AES encryption for messages

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/terminal-chat-app.git
cd terminal-chat-app

After Cloning project you must do
1.npm install

2.Set up environment variables like :
MONGO_URI=Your mongo uri
SECRET_KEY=your-encryption-secret-key
PORT=3000
LOCALHOST_URI=http://localhost:3000/

3.Start the server
node server.js

4.Start the client (in a separate terminal)
node client.js
