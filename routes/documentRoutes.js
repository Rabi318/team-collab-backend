const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const {
  createDocument,
  getWorkspaceDocuments,
  getDocumentById,
  updateDocumentContent,
  downloadDocument,
  deleteDocument,
  getCollaborators,
} = require("../controllers/documentController");

router.use(protect);

// Upload or create new document
router.post("/", upload.single("file"), createDocument);

// Get all documents for a workspace
router.get("/workspace/:workspaceId", getWorkspaceDocuments);

//get active collaborators for a document
// Get a specific document
router.get("/:docId", getDocumentById);
router.get("/:documentId/collaborators", getCollaborators);

// Update editable document's content
router.put("/:docId", updateDocumentContent);

// Download uploaded document
router.get("/download/:docId", downloadDocument);

// Delete a document
router.delete("/:docId", deleteDocument);

module.exports = router;
