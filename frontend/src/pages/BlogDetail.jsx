import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogById, likeBlog } from "../api";
import CommentSection from "../components/CommentSection";
import ShareButtons from "../components/ShareButtons";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import {
  FiHeart,
  FiArrowLeft,
  FiClock,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const getVisitorId = () => {
  let id = localStorage.getItem("blog_visitor_id");
  if (!id) {
    id = "visitor_" + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem("blog_visitor_id", id);
  }
  return id;
};

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  const visitorId = getVisitorId();
  const isLiked = blog?.likes?.includes(visitorId);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await getBlogById(id);
      setBlog(res.data.blog);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      toast.error("Blog not found");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    setLikeLoading(true);
    try {
      const res = await likeBlog(blog._id, visitorId);
      setBlog(res.data.blog);
      toast.success(res.data.liked ? "Liked! ❤️" : "Unliked");
    } catch (error) {
      toast.error("Failed to like blog");
    } finally {
      setLikeLoading(false);
    }
  };

  const renderMedia = () => {
    if (blog.mediaType === "none" || !blog.mediaUrl) return null;

    if (blog.mediaType === "video") {
      const youtubeMatch = blog.mediaUrl.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
      );
      if (youtubeMatch) {
        return (
          <div className="aspect-video rounded-xl overflow-hidden mb-8">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={blog.title}
            />
          </div>
        );
      }
      return (
        <video
          src={blog.mediaUrl}
          className="w-full rounded-xl mb-8"
          controls
          playsInline
        />
      );
    }

    if (blog.mediaType === "url") {
      return (
        <a
          href={blog.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 hover:bg-primary/10 transition-colors"
        >
          <p className="text-primary font-medium">🔗 {blog.mediaUrl}</p>
          <p className="text-gray-400 text-sm mt-1">Click to open external link</p>
        </a>
      );
    }

    return (
      <img
        src={blog.mediaUrl}
        alt={blog.title}
        className="w-full rounded-xl mb-8 max-h-[500px] object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/800x400?text=Blog+Image";
        }}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">😞</p>
        <p className="text-gray-500 text-lg mb-4">Blog not found</p>
        <Link to="/" className="text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors"
        >
          <FiArrowLeft size={18} />
          Back to all posts
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="mb-6">
              {blog.mediaType !== "none" && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4 capitalize">
                  {blog.mediaType}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                  <FiUser size={14} />
                  {blog.author?.username || "Admin"}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock size={14} />
                  {format(new Date(blog.createdAt), "MMMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <FiMessageCircle size={14} />
                  {blog.comments?.length || 0} comments
                </span>
              </div>
            </div>

            {renderMedia()}

            <div
              className="blog-content text-gray-700"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.description),
              }}
            />

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                    isLiked
                      ? "bg-red-50 text-danger border border-red-200"
                      : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-danger hover:border-red-200"
                  }`}
                >
                  <FiHeart
                    size={18}
                    className={isLiked ? "fill-current" : ""}
                  />
                  <span className="font-medium text-sm">
                    {blog.likes?.length || 0} {blog.likes?.length === 1 ? "Like" : "Likes"}
                  </span>
                </button>

                <ShareButtons blog={blog} onUpdate={setBlog} />
              </div>
            </div>
          </div>
        </article>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 p-6 md:p-10">
          <CommentSection blog={blog} onUpdate={setBlog} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
