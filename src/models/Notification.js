import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  triggeredUsers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      seen: {
        type: Boolean,
        default: false,
      },
    },
  ],
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "entityType", // Dynamic reference based on entityType
  },
  entityType: {
    type: String,
    enum: ["Post", "User", "Other"], // Add other types as needed
    default: null, // Optional for notifications that don't need an entity reference
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["new-comment", "new-like", "new-follow", "new-post"], 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
