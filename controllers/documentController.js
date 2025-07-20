const Document = require("../models/documentModel");
const Workspace = require("../models/workspaceModel");
const path = require("path");

exports.createDocument = async (req, res) => {
  try {
    const { title, content, workspaceId, access = "workspace" } = req.body;
    const file = req.file;
    if (!workspaceId)
      return res.status(400).json({ msg: "Workspace ID is required" });
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ msg: "Workspace not found" });

    let newDoc;
    if (file) {
      newDoc = new Document({
        title: title || file.originalname,
        filePath: file.filename,
        fileType: file.mimetype,
        access,
        workspaceId,
        createdBy: req.user.id,
      });
    } else {
      newDoc = new Document({
        title,
        content,
        access,
        workspaceId,
        createdBy: req.user.id,
        versions: [
          {
            content,
            editedBy: req.user.id,
          },
        ],
      });
    }
    const saveDoc = await newDoc.save();
    workspace.documents.push(saveDoc._id);
    await workspace.save();
    res.status(201).json({ msg: "Document created", data: saveDoc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//Get all documents in a workspace
exports.getWorkspaceDocuments = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const documents = await Document.find({ workspaceId }).populate(
      "createdBy",
      "name email"
    );
    res.status(200).json({ msg: "Documents fetched", data: documents });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//Get single document
exports.getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.docId)
      .populate("createdBy", "name email")
      .populate("versions.editedBy", "name email");
    if (!doc) return res.status(404).json({ msg: "Document not found" });
    res.status(200).json({ msg: "Document fetched", data: doc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//update doc content (for editable documents)
exports.updateDocumentContent = async (req, res) => {
  try {
    const { docId } = req.params;
    const { content } = req.body;
    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ msg: "Document not found" });
    doc.content = content;
    doc.versions.push({
      content,
      editedBy: req.user.id,
    });
    await doc.save();
    res.status(200).json({ msg: "Document updated", data: doc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//Download the uploaded document
exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.docId);
    if (!doc || !doc.filePath)
      return res.status(404).json({ msg: "Document not found" });
    const filePath = path.join(__dirname, "../uploads", doc.filePath);
    res.download(filePath, doc.title);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//Delete a document
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.docId);
    if (!doc) return res.status(404).json({ msg: "Document not found" });
    await Document.findByIdAndDelete(req.params.docId);
    //Optional remove from workspace
    await Workspace.findByIdAndDelete(doc.workspaceId, {
      $pull: {
        documents: doc._id,
      },
    });
    res.status(200).json({ msg: "Document deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.getCollaborators = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId).populate(
      "workspaceId"
    );
    if (!document) return res.status(404).json({ msg: "Document not found" });

    const workspace = await Workspace.findById(document.workspaceId).populate(
      "members.userId"
    );
    if (!workspace) return res.status(404).json({ msg: "Workspace not found" });
    const activeMembers = workspace.members
      .filter((member) => member.status === "active")
      .map((member) => ({
        _id: member.userId._id,
        name: member.userId.name,
        email: member.userId.email,
      }));
    res.status(200).json({ msg: "Collaborators fetched", data: activeMembers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};
