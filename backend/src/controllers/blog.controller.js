import { Blog } from "../model/blog.model.js";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Get all blogs error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "username");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog });
  } catch (error) {
    console.error("Get blog by ID error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, description, mediaType, mediaUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const blog = await Blog.create({
      title,
      description,
      mediaType: mediaType || "none",
      mediaUrl: mediaUrl || "",
      author: req.admin._id,
    });

    await blog.populate("author", "username");

    res.status(201).json({ blog });
  } catch (error) {
    console.error("Create blog error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, description, mediaType, mediaUrl } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this blog" });
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.mediaType = mediaType !== undefined ? mediaType : blog.mediaType;
    blog.mediaUrl = mediaUrl !== undefined ? mediaUrl : blog.mediaUrl;

    await blog.save();
    await blog.populate("author", "username");

    res.status(200).json({ blog });
  } catch (error) {
    console.error("Update blog error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ message: "Visitor ID is required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const alreadyLiked = blog.likes.includes(visitorId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter((id) => id !== visitorId);
    } else {
      blog.likes.push(visitorId);
    }

    await blog.save();
    await blog.populate("author", "username");

    res.status(200).json({ blog, liked: !alreadyLiked });
  } catch (error) {
    console.error("Like blog error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { username, text } = req.body;

    if (!username || !text) {
      return res.status(400).json({ message: "Username and comment text are required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({ username, text });
    await blog.save();
    await blog.populate("author", "username");

    res.status(201).json({ blog });
  } catch (error) {
    console.error("Add comment error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const shareBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.shareCount += 1;
    await blog.save();
    await blog.populate("author", "username");

    res.status(200).json({ blog, shareCount: blog.shareCount });
  } catch (error) {
    console.error("Share blog error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
