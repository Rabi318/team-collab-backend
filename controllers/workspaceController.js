const Workspace = require("../models/workspaceModel");
const User = require("../models/userModel");

//create a new workspace
exports.createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;
    const ownerId = req.user.id;
    const newWorkspace = new Workspace({
      name,
      owner: ownerId,
      members: [
        {
          userId: ownerId,
          role: "admin",
          staus: "active",
        },
      ],
    });
    const savedWorkspace = await newWorkspace.save();

    await User.findByIdAndUpdate(
      ownerId,
      {
        $addToSet: { workspaces: savedWorkspace._id },
      },
      {
        new: true,
      }
    );
    res.status(201).json({ msg: "Workspace Created", data: savedWorkspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//Get all workspaces user is part of
exports.getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id;
    const workspaces = await Workspace.find({
      "members.userId": userId,
    }).populate("owner", "name email");
    res.status(200).json({ msg: "Workspaces Fetched", data: workspaces });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//Get single workspace by ID
exports.getWorkspaceById = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId)
      .populate("members.userId", "name email role")
      .populate("owner", "name email")
      .populate("documents", "title _id");
    if (!workspace) {
      return res.status(404).json({ msg: "Workspace not found" });
    }
    res.status(200).json({ msg: "Workspace Fetched", data: workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//Invite a member to workspace
exports.inviteMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { userId, role } = req.body;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ msg: "Workspace not found" });

    //only admin can invite
    const requresintMember = workspace.members.find(
      (m) => m.userId.toString() === req.user.id
    );
    if (!requresintMember || requresintMember.role !== "admin")
      return res.status(403).json({ msg: "Only Admins can invite members" });

    //prevent duplicate invites
    const alreadyMember = workspace.members.find(
      (m) => m.userId.toString() === userId
    );
    if (alreadyMember)
      return res.status(400).json({ msg: "User already invited" });

    workspace.members.push({
      userId,
      role: role || "member",
      status: "invited",
    });
    await workspace.save();

    //add workspace to the invited user's workspace
    await User.findByIdAndUpdate(userId, {
      $addToSet: { workspaces: workspace._id },
    });

    res.status(200).json({ msg: "Member Invited", data: workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//update a member's role
exports.updateMemberRole = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ msg: "Workspace not found" });
    const requestingMember = workspace.members.find(
      (m) => m.userId.toString() === req.user.id
    );
    if (!requestingMember || requestingMember.role !== "admin") {
      return res.status(403).json({ msg: "Only Admins can update members" });
    }
    const member = workspace.members.find(
      (m) => m.userId.toString() === memberId
    );
    if (!member) return res.status(404).json({ msg: "Member not found" });
    member.role = role;
    await workspace.save();
    res.status(200).json({ msg: "Member role updated", data: workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//Remove member
exports.removeMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ msg: "Workspace not found" });
    const requester = workspace.members.find(
      (m) => m.userId.toString() === req.user.id
    );
    if (!requester || requester.role !== "admin") {
      return res.status(403).josn({ msg: "Only Admin can remove members" });
    }
    workspace.members = workspace.members.filter(
      (m) => m.userId.toString() !== memberId
    );
    await workspace.save();
    res.status(200).json({ msg: "Member removed", data: workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//Delete workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ msg: "Workspace not found" });
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only owner can delete workspace" });
    }
    await workspace.deleteOne();
    res.status(200).json({ msg: "Workspace deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.updateMemberStatus = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const { status } = req.body;

    if (!["active", "removed"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ msg: "Workspace not found" });
    const member = workspace.members.find(
      (m) => m.userId.toString() === memberId
    );
    if (!member) return res.status(404).json({ msg: "Member not found" });
    if (member.status !== status) {
      member.status = status;
      await workspace.save();
    }
    res.status(200).json({ msg: "Member status updated", data: workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};
