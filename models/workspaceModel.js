const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: {
    type: String,
    enum: ["admin", "member", "viewer"],
    default: "member",
  },
  joinedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "invited", "removed"],
    default: "invited",
  },
});

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [memberSchema],
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    chatChannels: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ChatChannel" },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workspace", workspaceSchema);
