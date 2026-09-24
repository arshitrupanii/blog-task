import { useState } from "react";
import { addComment } from "../api";
import { FiSend, FiUser, FiMessageCircle } from "react-icons/fi";
import { format } from "date-fns";
import toast from "react-hot-toast";

const CommentSection = ({ blog, onUpdate }) => {
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !text.trim()) {
      toast.error("Please enter your name and comment");
      return;
    }

    setLoading(true);
    try {
      const res = await addComment(blog._id, {
        username: username.trim(),
        text: text.trim(),
      });
      onUpdate(res.data.blog);
      setText("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-dark flex items-center gap-2 mb-6">
        <FiMessageCircle />
        Comments ({blog.comments?.length || 0})
      </h3>

      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 rounded-xl p-4">
        <div className="flex gap-3 mb-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <FiUser className="text-primary" size={16} />
          </div>
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            maxLength={50}
          />
        </div>
        <div className="flex gap-3">
          <div className="w-8 flex-shrink-0" />
          <textarea
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            rows={3}
            maxLength={500}
          />
        </div>
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <FiSend size={14} />
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {blog.comments?.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
        {blog.comments
          ?.slice()
          .reverse()
          .map((comment, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                <span className="text-accent text-sm font-medium">
                  {comment.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 bg-white border border-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-dark">
                    {comment.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {comment.createdAt
                      ? format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")
                      : "Just now"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{comment.text}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentSection;
