import readline from "readline";
import { decrypt, encrypt } from "./encryptMessageFunctions.js";
import axios from "axios";
import { PrivateMessage } from "../models/privateMessage.model.js";
import { GroupMessage } from "../models/groupMessage.model.js";
import { User } from "../models/user.model.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function firstFunction(socket) {
  console.clear();
  console.log("Welcome to the node.js chat app!");
  console.log("Please select an option from the menu below:");
  console.log("1. Login");
  console.log("2. Register");
  console.log("3. Exit");

  rl.question("Enter choice number: ", (choice) => {
    if (choice === "1") {
      loginFunction(socket, rl);
    } else if (choice === "2") {
      registerFunction(socket, rl);
    } else if (choice === "3") {
      rl.close();
      process.exit(0);
    } else {
      console.log("Invalid choice, try again.");
      setTimeout(() => firstFunction(socket), 1000);
    }
  });
}

function loginFunction(socket) {
  console.clear();
  console.log("Login (press Enter twice to go back)");

  rl.question("Username: ", (username) => {
    rl.question("Password: ", (password) => {
      if (username === "" && password === "") {
        return firstFunction(socket);
      }

      socket.emit("login", username, password, (isSuccess, currentUser) => {
        console.log("✅ Login result:", isSuccess);
        if (isSuccess) {
          console.log("✅ Logged in successfully! Welcome To The Chat UI !");
          setTimeout(() => chatMenu(socket, currentUser), 2000);
        } else {
          console.log("❌ Login failed. Try again.");
          setTimeout(() => firstFunction(socket), 1500);
        }
      });
    });
  });
}

function registerFunction(socket) {
  console.clear();
  console.log("Register (press Enter twice to go back)");

  rl.question("Create a username: ", (newUsername) => {
    rl.question("Create a password: ", (newPassword) => {
      if (newUsername === "" && newPassword === "") {
        return firstFunction(socket);
      }
      socket.emit("register", newUsername, newPassword, (isSuccess) => {
        console.log("✅ Registration result:", isSuccess);
        if (isSuccess) {
          console.log("✅ Registered successfully! Returning to main menu...");
        } else {
          console.log("❌ Registration failed. Try again.");
        }
        setTimeout(() => firstFunction(socket), 2000);
      });
    });
  });
}

function chatMenu(socket, currentUser) {
  console.clear();
  console.log("Chat Menu");
  console.log("Please select an option from the menu below:");
  console.log("1. Private Chat");
  console.log("2. Group Chat");
  console.log("3. Back");
  rl.question("Enter choice number: ", async (choice) => {
    if (choice === "1") {
      await privateMessageMenu(socket, currentUser);
    } else if (choice === "2") {
      await groupMenu(socket, currentUser);
    } else if (choice === "3") {
      firstFunction(socket);
    } else {
      console.log("Invalid choice, try again.");
      setTimeout(() => chatMenu(socket, currentUser), 1000);
    }
  });
}

async function privateMessageMenu(socket, currentUser) {
  console.clear();
  console.log("Private Message Menu");
  const resUsers = await axios.get(`${process.env.LOCALHOST_URI}api/users`);
  let users = resUsers.data;
  users = users.filter((u) => u._id !== currentUser._id);
  users.forEach((user, index) => {
    console.log(`${index + 1}.${user.username}`);
  });
  rl.question(
    "Select a user to send a private message:",
    (selectedUserChoice) => {
      const selectedUserChoiceInt = parseInt(selectedUserChoice);
      if (selectedUserChoiceInt >= 1 && selectedUserChoiceInt <= users.length) {
        const selectedUser = users[selectedUserChoiceInt - 1];
        sendPrivateMessage(currentUser, selectedUser, socket);
      } else {
        console.log("Invalid choice, try again.");
        setTimeout(() => chatMenu(socket, currentUser), 1000);
      }
    }
  );
}

async function sendPrivateMessage(currentUser, selectedUser, socket) {
  console.clear();
  const messagesBetweenUsers = await PrivateMessage.find({
    $or: [
      { sender: currentUser._id, receiver: selectedUser._id },
      { sender: selectedUser._id, receiver: currentUser._id },
    ],
  }).sort({ created_at: 1 }); // Optional: sort by time ascending
  console.log(
    `CHAT HISTORY BETWEEN ${currentUser.username}(YOU) AND OTHER USER(${selectedUser.username})`
  );

  messagesBetweenUsers.forEach((msg) => {
    const decryptedMsg = decrypt(msg.text);

    const date = new Date(msg.created_at);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

    if (msg.sender._id.toString() === currentUser._id.toString()) {
      console.log(`You : ${decryptedMsg}   [${formattedDate}]`);
    } else {
      console.log(
        `${selectedUser.username} : ${decryptedMsg}   [${formattedDate}]`
      );
    }
  });

  rl.question("Write Message to Send : ", (msg) => {
    const encryptedMsg = encrypt(msg);
    socket.emit(
      "send_private_message",
      currentUser,
      selectedUser,
      encryptedMsg,
      (isSuccess) => {
        console.log("✅ Sending private message result:", isSuccess);
        if (isSuccess) {
          console.log("✅ Sended successfully! Returning to main menu...");
        } else {
          console.log("❌ Sending private message failed. Try again.");
        }
        setTimeout(
          () => sendPrivateMessage(currentUser, selectedUser, socket),
          1500
        );
      }
    );
  });
}

async function groupMenu(socket, currentUser) {
  console.clear();
  console.log("Chat Menu");
  console.log("Please select an option from the menu below:");
  console.log("1. Join Group Live Chat");
  console.log("2. Create Group");
  console.log("3. Back");
  rl.question("Enter choice number: ", async (choice) => {
    if (choice === "1") {
      await joinGroupMenu(socket, currentUser);
    } else if (choice === "2") {
      createGroupMenu(socket, currentUser);
    } else if (choice === "3") {
      chatMenu(socket, currentUser);
    } else {
      console.log("Invalid choice, try again.");
      setTimeout(() => groupMenu(socket, currentUser), 1000);
    }
  });
}

async function joinGroupMenu(socket, currentUser) {
  console.clear();
  console.log("Join Group Menu");
  console.log("Please Select Group For Joining Group Live Chat");

  try {
    const response = await axios.get(`${process.env.LOCALHOST_URI}api/groups`);
    let groups = response.data;

    if (groups.length === 0) {
      console.log("No groups available");
      setTimeout(() => groupMenu(socket, currentUser), 1500);
    }

    console.log("Available Groups to Join:");
    groups.forEach((group, index) => {
      console.log(`${index + 1}. ${group.name}`);
    });

    rl.question("Select a group to join live chat : ", (selectedUserChoice) => {
      const selectedUserChoiceInt = parseInt(selectedUserChoice);
      if (
        selectedUserChoiceInt >= 1 &&
        selectedUserChoiceInt <= groups.length
      ) {
        const selectedGroup = groups[selectedUserChoiceInt - 1];
        socket.emit("join_group", selectedGroup.name);
        sendGroupMessage(socket, currentUser, selectedGroup);
      } else {
        console.log("Invalid choice, try again.");
        setTimeout(() => groupMenu(socket, currentUser), 1000);
      }
    });

    // Add further logic here for selecting and joining a group
  } catch (error) {
    console.error("Failed to fetch groups:", error.message);
  }
}

async function sendGroupMessage(socket, currentUser, selectedGroup) {
  console.clear();
  const messagesOfGroup = await GroupMessage.find({
    group: selectedGroup._id,
  })
    .populate({
      path: "sender",
      select: "-password", // Exclude the password field
    })
    .sort({ created_at: 1 });

  console.log(`CHAT HISTORY OF GROUP ${selectedGroup.name} `);

  messagesOfGroup.forEach((msg) => {
    const decryptedMsg = decrypt(msg.text);

    const date = new Date(msg.created_at);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

    console.log(
      `${msg.sender.username} : ${decryptedMsg}   [${formattedDate}]`
    );
  });

  rl.question("Write Message to Send : ", (msg) => {
    const encryptedMsg = encrypt(msg);
    socket.emit(
      "send_group_message",
      selectedGroup,
      encryptedMsg,
      currentUser,
      (isSuccess) => {
        console.log("✅ Sending group message result:", isSuccess);
        if (isSuccess) {
          console.log("✅ Sended successfully! Returning to main menu...");
        } else {
          console.log("❌ Sending group message failed. Try again.");
        }
        setTimeout(
          () => sendGroupMessage(socket, currentUser, selectedGroup),
          1500
        );
      }
    );
  });
}

function createGroupMenu(socket, currentUser) {
  console.clear();
  if (currentUser.role === "admin") {
    rl.question("Enter group name to create : ", (groupName) => {
      socket.emit("create_group", groupName, (isSuccess) => {
        console.log("✅ Creating group result:", isSuccess);
        if (isSuccess) {
          console.log("✅ Created successfully! Returning to main menu...");
        } else {
          console.log("❌ Creating group  failed. Try again.");
        }
        setTimeout(() => groupMenu(socket, currentUser), 1500);
      });
    });
  } else {
    console.log("Can not create group because only admins can create group");
    setTimeout(() => groupMenu(socket, currentUser), 1500);
  }
}
