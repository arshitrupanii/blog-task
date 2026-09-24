import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { FiMenu, FiX, FiLogOut, FiPlusCircle, FiGrid } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-dark hover:text-primary transition-colors">
            Blog
          </Link>

          {admin && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/admin/dashboard"
                className="text-gray-600 hover:text-primary flex items-center gap-1 transition-colors"
              >
                <FiGrid size={18} />
                Dashboard
              </Link>
              <Link
                to="/admin/blog/new"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-1 transition-colors"
              >
                <FiPlusCircle size={18} />
                New Blog
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-danger flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          )}

          {admin && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600 cursor-pointer"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          )}
        </div>

        {admin && isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/blog/new"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg"
            >
              New Blog
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-danger hover:bg-red-50 rounded-lg cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
