import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true, // Set the expiration time to 1 minute after creation
      default: () => new Date(Date.now() + 1 * 60 * 1000),
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);


storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save hook to set expiresAt to 1 minute after creation for testing
storySchema.pre("save", function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 1 * 60 * 1000); // Set expiration to 1 minute after creation
  }
  next();
});

const Story = mongoose.models.Story || mongoose.model("Story", storySchema);

export default Story;
