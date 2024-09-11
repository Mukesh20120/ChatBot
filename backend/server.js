const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

const rangeValue = (start, end) => {
  return start + Math.random() * (end - start);
};
let conversation = {};
io.on("connection", (socket) => {
  let clientId;
  const getUserId = socket.handshake.query?.id;

  if (getUserId !== null && getUserId !== undefined && getUserId !== "null") {
    console.log("Existing user connected: " + getUserId);
    clientId = getUserId;
    const existingConversation = conversation[getUserId];
    if (existingConversation) {
      socket.emit("Pre_Conversation", existingConversation);
    }
  } else {
    console.log("a user is connected", socket.id);
    const userId = uuid();
    clientId = userId;
    setTimeout(() => {
      const newMessage = {
        user: "server",
        message: "Hello how can i help you?",
        isUnread: true,
      };
      socket.emit("Greeting", newMessage);
      conversation[userId] = [newMessage];
    }, 3000);

    socket.emit("Assign_Id", userId);
  }
  socket.on("New_Message", (data) => {
    conversation[clientId] = conversation[clientId]
      ? conversation[clientId]
      : [];
    conversation[clientId].push(data);
    setTimeout(() => {
      socket.emit("Read_Message");
    }, rangeValue(2000, 3500));
    setTimeout(() => {
      socket.emit("Is_Typing");
    }, rangeValue(3500, 5000));
    setTimeout(() => {
      const newMessage = {
        user: "server",
        message: "That is the good question?",
        isUnread: true,
      };
      socket.emit("Reply_Message", newMessage);
      conversation[clientId].push(newMessage);
    }, rangeValue(5000, 6500));
  });
  socket.on("disconnect", () => {
    console.log("user has disconnected -_-");
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../frontend", "build", "index.html"))
  );
  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ success: true, message: "server is running fine..." });
  });
}

server.listen(4000, () => {
  console.log("server is running 4000...");
});
