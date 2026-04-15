import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/project.js"
import taskRoutes from "./routes/task.js";
import executionRoutes from './routes/execution.js'

dotenv.config();

const app = express();
const server = http.createServer(app);
// const cors = require("cors");


export const io = new Server(server, {
  cors: { origin: "*" },
});


// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://your-frontend-url.onrender.com"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

// app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/execution", executionRoutes);



mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);