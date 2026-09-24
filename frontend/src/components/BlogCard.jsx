import { Link } from "react-router-dom";
import { FiHeart, FiMessageCircle, FiShare2, FiClock } from "react-icons/fi";
import { format } from "date-fns";

const BlogCard = ({ blog }) => {
  const renderMedia = () => {
    if (blog.mediaType === "none" || !blog.mediaUrl) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
      );
    }

    if (blog.mediaType === "video") {
      const youtubeMatch = blog.mediaUrl.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
      );
      if (youtubeMatch) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            className="w-full h-48"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={blog.title}
          />
        );
      }
      return (
        <video
          src={blog.mediaUrl}
          className="w-full h-48 object-cover"
          muted
          loop
          onMouseOver={(e) => e.target.play()}
          onMouseOut={(e) => e.target.pause()}
        />
      );
    }

    return (
      <img
        src={blog.mediaUrl}
        alt={blog.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/800x400?text=Blog+Image";
        }}
      />
    );
  };

  const getExcerpt = (html, maxLength = 120) => {
    const text = html.replace(/<[^>]*>/g, "");
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Link to={`/blog/${blog._id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="overflow-hidden">{renderMedia()}</div>

        <div className="p-5">
          {blog.mediaType !== "none" && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3 capitalize">
              {blog.mediaType}
            </span>
          )}

          <h3 className="text-lg font-semibold text-dark group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {blog.title}
          </h3>

          <p className="text-gray-500 text-sm line-clamp-3 mb-4">
            {getExcerpt(blog.description)}
          </p>

          <div className="flex items-center justify-between text-gray-400 text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FiHeart size={14} />
                {blog.likes?.length || 0}
              </span>
              <span className="flex items-center gap-1">
                <FiMessageCircle size={14} />
                {blog.comments?.length || 0}
              </span>
              <span className="flex items-center gap-1">
                <FiShare2 size={14} />
                {blog.shareCount || 0}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <FiClock size={14} />
              {format(new Date(blog.createdAt), "MMM d")}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {blog.author?.username?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {blog.author?.username || "Admin"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
