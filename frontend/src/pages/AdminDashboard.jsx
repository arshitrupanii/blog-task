import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllBlogs, deleteBlog } from "../api";
import useAuthStore from "../store/useAuthStore";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiEye,
} from "react-icons/fi";
import { format } from "date-fns";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs();
      const myBlogs = res.data.blogs.filter(
        (blog) => blog.author?._id === admin?._id
      );
      setBlogs(myBlogs);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter((b) => b._id !== id));
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  const totalLikes = blogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0);
  const totalComments = blogs.reduce((sum, b) => sum + (b.comments?.length || 0), 0);
  const totalShares = blogs.reduce((sum, b) => sum + (b.shareCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {admin?.username}!</p>
          </div>
          <Link
            to="/admin/blog/new"
            className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 font-medium"
          >
            <FiPlus size={18} />
            Create New Blog
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-400 text-sm">Total Posts</p>
            <p className="text-2xl font-bold text-dark mt-1">{blogs.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <FiHeart size={14} /> Likes
            </p>
            <p className="text-2xl font-bold text-danger mt-1">{totalLikes}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <FiMessageCircle size={14} /> Comments
            </p>
            <p className="text-2xl font-bold text-primary mt-1">{totalComments}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <FiShare2 size={14} /> Shares
            </p>
            <p className="text-2xl font-bold text-accent mt-1">{totalShares}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-dark">Your Blog Posts</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">✍️</p>
              <p className="text-gray-500 mb-4">No blogs yet. Create your first post!</p>
              <Link
                to="/admin/blog/new"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <FiPlus size={16} />
                Create Blog
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-full sm:w-20 h-32 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {blog.mediaUrl && blog.mediaType !== "none" ? (
                      <img
                        src={blog.mediaUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentNode.innerHTML =
                            '<div class="w-full h-full flex items-center justify-center text-2xl">📝</div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📝
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-dark truncate">{blog.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>{format(new Date(blog.createdAt), "MMM d, yyyy")}</span>
                      <span className="flex items-center gap-1">
                        <FiHeart size={12} /> {blog.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMessageCircle size={12} /> {blog.comments?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiShare2 size={12} /> {blog.shareCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="View"
                    >
                      <FiEye size={18} />
                    </Link>
                    <Link
                      to={`/admin/blog/edit/${blog._id}`}
                      className="p-2 text-gray-400 hover:text-secondary hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
