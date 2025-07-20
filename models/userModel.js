const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    avatar: String,
    provider: {
      type: String,
      enum: ["local", "google", "github", "facebook"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
