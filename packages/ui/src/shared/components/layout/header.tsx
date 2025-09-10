import React, { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { DesktopNav } from "./desktop-nav";
import { FaHamburger } from "react-icons/fa";
import { LoginButton } from "../login-button";
import { useLayout } from "@/context/layout-context";
import classNames from "classnames";
import Logo from "@/shared/assets/sandbox-logo.png"
interface HeaderProps {
  links: Array<{ to: string; label: string; icon?: React.ReactNode }>;
  onSidebarToggle?: () => void;
  showSidebarToggle?: boolean;
}

export function Header({ links, onSidebarToggle, showSidebarToggle }: HeaderProps) {
  const { isLoading } = useLayout();
  const routerState = useRouterState();
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Check if current pathname starts with /admin
  const isAdminRoute = routerState.location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Calculate scroll progress (0 to 1)
      const progress = Math.min(currentScrollY / documentHeight, 1);
      setScrollProgress(progress);

      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down, hide header
      } else {
        setIsVisible(true); // Scrolling up, show header
      }

      // Add scrolled effect when past 20px
      setIsScrolled(currentScrollY > 20);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className="">
      <div
        className={classNames(
          "header",
          {
            "translate-y-0": isVisible,
            "-translate-y-full": !isVisible,
            "backdrop-blur-md": isScrolled,
            "": !isScrolled,
          }
        )}
      >
        
        <div className="navbar-start">
          {showSidebarToggle && (
            <button
              className="btn btn-ghost btn-sm p-2 lg:hidden"
              onClick={onSidebarToggle}
              aria-label="Toggle sidebar"
            >
              <FaHamburger />
            </button>
          )}

          <Link to="/" className="text-xl">
            <img src={Logo} alt="Sandbox Logo" className="w-50" />
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <DesktopNav links={links} />
        </div>

        <div className="navbar-end">{isAdminRoute && <LoginButton isLoading={isLoading} />}</div>
        {/* Subtle top border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

      </div>

      {/* Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-40 h-1 bg-primary/20"
        style={{
          transform: `scaleX(${scrollProgress})`,
          transformOrigin: "left",
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300" />
      </div>
      
    </header>
  );
}
