// models/Document.js
const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema({
  content: { type: mongoose.Schema.Types.Mixed },
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
});

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed }, // for real-time editable docs
    filePath: { type: String }, // for uploaded files (optional)
    fileType: { type: String }, // e.g., "application/pdf", "image/png"
    access: {
      type: String,
      enum: ["private", "workspace"],
      default: "workspace",
    },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    versions: [versionSchema],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
