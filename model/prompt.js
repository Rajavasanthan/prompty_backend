const mongoose = require("mongoose");

const PromptSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
    enum: ["nano_banana", "chat_gpt"],
  },
  imageUrls: [
    {
      type: String,
      required: true,
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Prompt = mongoose.model("prompt", PromptSchema);
module.exports = { Prompt };
