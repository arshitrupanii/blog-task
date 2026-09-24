import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required for comment"],
    trim: true,
  },
  text: {
    type: String,
    required: [true, "Comment text is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Blog description is required"],
    },
    mediaType: {
      type: String,
      enum: ["image", "gif", "video", "url", "none"],
      default: "none",
    },
    mediaUrl: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    shareCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
