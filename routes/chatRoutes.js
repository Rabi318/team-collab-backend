const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getChannelMessages,
  getWorkspaceChannels,
  createChannel,
} = require("../controllers/chatController");

router.use(protect);

// Get messages in a channel
router.post("/channels", createChannel);
router.get("/channel/:channelId/messages", getChannelMessages);

// Get all channels in a workspace
router.get("/workspace/:workspaceId/channels", getWorkspaceChannels);

module.exports = router;
