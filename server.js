const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const documentSocket = require("./socket/documentScockets");
const chatSockets = require("./socket/chatSockets");

const app = express();
connectDB();

//middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

//Routes
app.get("/test", (req, res) => {
  res.send("test");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/workspaces", require("./routes/workspaceRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

//404
app.use((req, res) => {
  res.status(404).json({
    msg: "route not found",
  });
});

//create http server and attach socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
//initialize documnet sockets
documentSocket(io);
//initialize chat sockets
chatSockets(io);

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
