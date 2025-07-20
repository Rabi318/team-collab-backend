const ChatChannel = require("../models/chatChannelModel");
const Message = require("../models/messageModel");

const chatSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Chat user connected:", socket.id);

    // Join a chat channel
    socket.on("join-chat", ({ channelId }) => {
      socket.join(channelId);
      console.log(`🔁 Joined channel: ${channelId}`);
    });

    // Send a new message
    socket.on(
      "send-message",
      async ({ channelId, senderId, content, type = "text" }) => {
        try {
          const message = new Message({
            sender: senderId,
            channelId,
            content,
            type,
          });

          const saved = await message.save();

          const populatedMessage = await Message.findById(saved._id)
            .populate("sender", "name avatar")
            .lean();
          // Push to channel's message list
          // await ChatChannel.findByIdAndUpdate(channelId, {
          //   $push: { messages: saved._id },
          // });

          // Emit to everyone in the room
          io.to(channelId).emit("receive-message", populatedMessage);
        } catch (error) {
          console.log("Error sending or saving message:", error);
          socket.emit("message-error", {
            channelId,
            error: "Failed to send message",
          });
        }
      }
    );

    // Seen message by user
    socket.on("mark-seen", async ({ messageId, userId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: { seenBy: userId },
        });
      } catch (error) {
        console.log("Error marking message seen:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Chat user disconnected:", socket.id);
    });
  });
};

module.exports = chatSockets;
