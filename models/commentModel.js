const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    sectionId: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    replies: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
