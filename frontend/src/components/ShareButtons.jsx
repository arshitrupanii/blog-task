import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { shareBlog } from "../api";
import { FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";

const ShareButtons = ({ blog, onUpdate }) => {
  const shareUrl = window.location.href;
  const title = blog.title;

  const handleShare = async () => {
    try {
      const res = await shareBlog(blog._id);
      if (onUpdate) onUpdate(res.data.blog);
    } catch {
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
    handleShare();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-gray-500 text-sm flex items-center gap-1">
        <FiShare2 size={16} />
        Share:
      </span>

      <FacebookShareButton url={shareUrl} title={title} beforeOnClick={handleShare}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={title} beforeOnClick={handleShare}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton url={shareUrl} title={title} beforeOnClick={handleShare}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>

      <WhatsappShareButton url={shareUrl} title={title} beforeOnClick={handleShare}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <button
        onClick={copyLink}
        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors cursor-pointer"
      >
        Copy Link
      </button>

      {blog.shareCount > 0 && (
        <span className="text-xs text-gray-400">
          {blog.shareCount} share{blog.shareCount !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
};

export default ShareButtons;
