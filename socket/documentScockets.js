const Document = require("../models/documentModel");
const documentSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected: ", socket.id);

    socket.on("join-document", async ({ documentId, userId }) => {
      if (!documentId || !userId) {
        console.warn("Invalid data for join-document:", { documentId, userId });
        return;
      }

      socket.join(documentId);
      const doc = await Document.findById(documentId);
      if (doc) {
        socket.emit("load-document", doc.content || { ops: [] });
      }
    });
    socket.on("send-changes", ({ documentId, delta }) => {
      socket.to(documentId).emit("receive-changes", delta);
    });
    socket.on("save-document", async ({ documentId, content, userId }) => {
      try {
        // await Document.findByIdAndUpdate(documentId, {
        //   content,
        //   $push: {
        //     versions: {
        //       content,
        //       editedBy: userId,
        //     },
        //   },
        // });
        const doc = await Document.findById(documentId);
        if (!doc) return;
        doc.content = content;
        doc.versions.push({
          content,
          editedBy: userId,
        });
        await doc.save();
      } catch (error) {
        console.log("Save error: ", error);
      }
    });
    socket.on("disconnect", () => {
      console.log("Disconnected: ", socket.id);
    });
  });
};
module.exports = documentSocket;
