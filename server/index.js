import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http"; // Import Node.js http module
import { Server } from "socket.io"; // Import Server from socket.io
import connectDB from "./config/db.js";
import Message from "./models/Message.js";
import User from './models/User.js';

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js'
import reviewRoutes from "./routes/reviewRoutes.js";

// --- Server and Socket.io Setup ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001;
connectDB();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

// --- Socket.io Connection Logic ---
let onlineUsers = []; 

const addUser = (userId, socketId) => {
  if (userId && !onlineUsers.some((user) => user.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log(`🔌 A user connected with socket ID: ${socket.id}`);

  // When a user connects, they should send their userId
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("Online users:", onlineUsers);
  });

  socket.on("joinRoom", (bookingId) => {
    socket.join(bookingId);
    console.log(`Socket ${socket.id} joined room: ${bookingId}`);
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, bookingId, text }) => {
      // 1. Save the message to the database (no change here)
      const message = new Message({
        booking: bookingId,
        sender: senderId,
        receiver: receiverId,
        text: text,
      });
      await message.save();

      // 2. Broadcast the message to everyone in the room *except the sender*
      socket.broadcast.to(bookingId).emit("receiveMessage", {
        booking: bookingId,
        sender: { _id: senderId },
        text: text,
        createdAt: new Date().toISOString(),
      });

      const receiver = getUser(receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("newMessageNotification", {
          bookingId: bookingId,
          senderName: (await User.findById(senderId).select("name")).name,
        });
      }

      console.log(`Message broadcasted to room: ${bookingId}`);
    }
  );

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(`🔌 A user disconnected. Socket ID: ${socket.id}`);
  });
});

// --- API Routes ---
app.get("/", (req, res) => {
  res.send("SkillSync API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/reviews", reviewRoutes);

// --- Server Listening ---
// Use `server.listen` instead of `app.listen` to run both Express and Socket.io
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
