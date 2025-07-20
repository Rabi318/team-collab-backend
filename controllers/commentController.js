const Comment = require("../models/commentModel");

// Add a new top-level comment
exports.addComment = async (req, res) => {
  try {
    const { documentId, sectionId, message } = req.body;

    const comment = new Comment({
      documentId,
      sectionId,
      author: req.user.id,
      message,
    });

    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all comments for a document
exports.getDocumentComments = async (req, res) => {
  try {
    const { documentId } = req.params;

    const comments = await Comment.find({ documentId })
      .populate("author", "name avatar")
      .populate("replies.author", "name avatar")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a reply to a comment
exports.addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { message } = req.body;

    const reply = {
      author: req.user.id,
      message,
      createdAt: new Date(),
    };

    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: reply } },
      { new: true }
    ).populate("replies.author", "name avatar");

    res.json(updated);
  } catch (err) {
    console.error("Add Reply Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
