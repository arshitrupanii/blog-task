import { FiHeart } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-dark">Blog</span>

          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Blog. All rights reserved to arshit rupani.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
