import Logo from "@/shared/assets/sandbox-logo.png";
export function Footer() {
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

          {/* Separator Line */}
          <div className="w-full max-w-4xl h-px bg-gray-500"></div>

          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm">
            © Made with ❤️ by{" "}
            <a
              href="https://wakeuplabs.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              Wake Up Labs
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
