// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatChannel" },
    content: { type: String, required: true },
    type: { type: String, enum: ["text", "file"], default: "text" },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
