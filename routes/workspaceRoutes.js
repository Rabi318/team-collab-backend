const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  inviteMember,
  updateMemberRole,
  removeMember,
  deleteWorkspace,
  updateMemberStatus,
} = require("../controllers/workspaceController");

//all routes below required authentication
router.use(protect);

// @route   POST /api/workspaces
// @desc    Create a new workspace
// @access  Authenticated users
router.post("/", createWorkspace);

// @route   GET /api/workspaces
// @desc    Get all workspaces current user is part of
// @access  Authenticated users
router.get("/", getUserWorkspaces);

// @route   GET /api/workspaces/:workspaceId
// @desc    Get single workspace details by ID
// @access  Authenticated users
router.get("/:workspaceId", getWorkspaceById);

// @route   POST /api/workspaces/:workspaceId/invite
// @desc    Invite a member to the workspace
// @access  Admins only
router.post("/:workspaceId/invite", inviteMember);

// @route   PUT /api/workspaces/:workspaceId/role/:memberId
// @desc    Update a member's role
// @access  Admins only
router.put("/:workspaceId/role/:memberId", updateMemberRole);

// @route   PUT /api/workspaces/:workspaceId/status/:memberId
// @desc    Update member's status (active or removed)
// @access  Admin or self
router.put("/:workspaceId/status/:memberId", updateMemberStatus);

// @route   DELETE /api/workspaces/:workspaceId/member/:memberId
// @desc    Remove a member from workspace
// @access  Admins only
router.delete("/:workspaceId/member/:memberId", removeMember);

// @route   DELETE /api/workspaces/:workspaceId
// @desc    Delete workspace
// @access  Owner only
router.delete("/:workspaceId", deleteWorkspace);

module.exports = router;
