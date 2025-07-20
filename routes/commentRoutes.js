const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const {
  addComment,
  getDocumentComments,
  addReply,
} = require("../controllers/commentController");

router.use(protect);

// Add a top-level comment
router.post("/", addComment);

// Get all comments for a document
router.get("/document/:documentId", getDocumentComments);

// Add a reply to an existing comment
router.post("/:commentId/replies", addReply);

module.exports = router;
