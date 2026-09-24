import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBlog, getBlogById, updateBlog } from "../api";
import RichTextEditor from "../components/RichTextEditor";
import {
  FiSave,
  FiImage,
  FiVideo,
  FiLink,
  FiFileText,
  FiArrowLeft,
} from "react-icons/fi";
import toast from "react-hot-toast";

const mediaTypeOptions = [
  { value: "none", label: "No Media", icon: FiFileText },
  { value: "image", label: "Image", icon: FiImage },
  { value: "gif", label: "GIF", icon: FiImage },
  { value: "video", label: "Video", icon: FiVideo },
  { value: "url", label: "URL/Link", icon: FiLink },
];

const AdminBlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("none");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await getBlogById(id);
      const blog = res.data.blog;
      setTitle(blog.title);
      setDescription(blog.description);
      setMediaType(blog.mediaType || "none");
      setMediaUrl(blog.mediaUrl || "");
    } catch (error) {
      toast.error("Failed to load blog");
      navigate("/admin/dashboard");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim() || description === "<p><br></p>") {
      toast.error("Description is required");
      return;
    }
    if (mediaType !== "none" && !mediaUrl.trim()) {
      toast.error("Please provide a media URL or select 'No Media'");
      return;
    }

    setLoading(true);
    try {
      const blogData = {
        title: title.trim(),
        description,
        mediaType,
        mediaUrl: mediaType !== "none" ? mediaUrl.trim() : "",
      };

      if (isEditing) {
        await updateBlog(id, blogData);
        toast.success("Blog updated successfully!");
      } else {
        await createBlog(blogData);
        toast.success("Blog created successfully!");
      }
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors cursor-pointer"
        >
          <FiArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h1 className="text-2xl font-bold text-dark mb-8">
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title..."
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Media Type
              </label>
              <div className="flex flex-wrap gap-2">
                {mediaTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMediaType(option.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        mediaType === option.value
                          ? "bg-primary text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <Icon size={16} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {mediaType !== "none" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Media URL *
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={
                    mediaType === "video"
                      ? "https://www.youtube.com/watch?v=... or direct video URL"
                      : mediaType === "url"
                      ? "https://example.com"
                      : "https://example.com/image.jpg"
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                {mediaUrl && (mediaType === "image" || mediaType === "gif") && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src={mediaUrl}
                      alt="Preview"
                      className="max-h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Blog Content *
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Write your blog content here..."
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors font-medium flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <FiSave size={18} />
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Blog"
                  : "Publish Blog"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogForm;
