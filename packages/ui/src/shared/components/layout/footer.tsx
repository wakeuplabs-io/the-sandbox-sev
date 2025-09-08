import { FaYoutube, FaComments } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "@tanstack/react-router";
import Logo from "@/shared/assets/sandbox-logo.png";
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white relative overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

      {/* Additional gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20"></div>
      {/* Main Footer Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo Section */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2"></div>
            <div className="flex items-center justify-center space-x-3">
              <img src={Logo} alt="Sandbox Logo" className="w-50" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
            <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">
              Vision
            </Link>
            <Link to="/admin/tasks" className="text-gray-300 hover:text-blue-400 transition-colors">
              Proposals
            </Link>
            <Link to="/admin/users" className="text-gray-300 hover:text-blue-400 transition-colors">
              Dashboard
            </Link>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              <FaYoutube className="w-4 h-4" />
              <span>Youtube</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              <FaComments className="w-4 h-4" />
              <span>Forum</span>
            </a>
            <a
              href="https://twitter.com/TheSandboxDAO"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              <FaXTwitter className="w-4 h-4" />
              <span>@TheSandboxDAO</span>
            </a>
          </div>

          {/* Separator Line */}
          <div className="w-full max-w-4xl h-px bg-gray-500"></div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
              Terms of Use
            </a>
            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
              Code of Conduct
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm">
            © {currentYear} The Sandbox DAO. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
