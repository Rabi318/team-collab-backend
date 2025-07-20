const ChatChannel = require("../models/chatChannelModel");
const Message = require("../models/messageModel");
const Workspace = require("../models/workspaceModel");

//get messages for a channel
exports.getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channelId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });
    res.status(200).json({ msg: "Messages fetched", data: messages });
  } catch (error) {
    console.log("Error fetching chat:", error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//get chat channels for a workspace
exports.getWorkspaceChannels = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const channels = await ChatChannel.find({ workspaceId }).populate(
      "members",
      "name"
    );
    res.status(200).json({ msg: "Channels fetched", data: channels });
  } catch (error) {
    console.log("Error fetching channels:", error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//create a new chat channel
exports.createChannel = async (req, res) => {
  try {
    const { name, workspaceId, isPrivate, members } = req.body;
    const creatorId = req.user.id;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ msg: "Workspace not found" });
    }
    const isMemberOfWorkspace = workspace.members.find(
      (m) => m.userId.toString() === creatorId
    );
    if (!isMemberOfWorkspace) {
      return res
        .status(403)
        .json({ msg: "You are not a member of this workspace" });
    }
    const existingChannel = await ChatChannel.findOne({ name, workspaceId });
    if (existingChannel) {
      return res.status(400).json({ msg: "Channel already exists" });
    }
    let channelMembers = [creatorId];
    if (isPrivate && members && Array.isArray(members)) {
      const workspaceMemberIds = workspace.members.map((m) =>
        m.userId.toString()
      );
      const validNewMembers = members.filter((memberId) =>
        workspaceMemberIds.includes(memberId)
      );
      channelMembers = [...new Set([...channelMembers, ...validNewMembers])];
    }
    const newChannel = await ChatChannel({
      name,
      workspaceId,
      isPrivate: isPrivate || false,
      members: channelMembers,
      messages: [],
    });
    const savedChannel = await newChannel.save();
    await Workspace.findByIdAndUpdate(workspaceId, {
      $push: { chatChannels: savedChannel._id },
    });
    res.status(200).json({ msg: "Channel created", data: savedChannel });
  } catch (error) {
    console.log("Error creating chat channel:", error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};
