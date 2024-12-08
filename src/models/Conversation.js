import mongoose from "mongoose";

// Define the conversation schema
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        readBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Users who have read this message
          },
        ],
      },
    ],
    lastMessage: {
      type: String,
      required: false, // Optionally store the last message for quick access
    },
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Track the sender of the last message
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Updates whenever a new message is sent
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Add a method to push a new message into the conversation
conversationSchema.methods.addMessage = async function (senderId, text) {
  // Add the message to the array
  const message = {
    sender: senderId,
    text,
    createdAt: new Date(),
    readBy: [senderId], // Mark the sender as having read their own message
  };

  this.messages.push(message);

  // Update the `lastMessage` and `lastMessageSender` fields
  this.lastMessage = text;
  this.lastMessageSender = senderId;

  // Update the timestamp of the last update
  this.updatedAt = new Date();

  // Save the updated conversation document
  await this.save();
};

// Add a method to mark messages as read for a specific participant
conversationSchema.methods.markAsRead = async function (userId) {
  this.messages.forEach((message) => {
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId); // Mark as read
    }
  });

  await this.save();
};

// Add a method to check for unread messages for a specific user
conversationSchema.methods.getUnreadMessages = function (userId) {
  return this.messages.filter(
    (message) => !message.readBy.includes(userId)
  );
};

// Create the Conversation model
const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;
