import React, { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { DesktopNav } from "./desktop-nav";
import { FaHamburger } from "react-icons/fa";
import { LoginButton } from "../login-button";
import { useLayout } from "@/context/layout-context";
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
    <>
      <div
        className={`
          fixed top-0 left-0 right-0 z-50 navbar px-4 transition-all duration-300 ease-in-out
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
          ${
            isScrolled
              ? "bg-base-100/95 backdrop-blur-md border-b border-base-300 shadow-lg"
              : "bg-base-100 border-b border-base-300"
          }
        `}
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
            <span className="hidden sm:block font-bold">Sandbox</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <DesktopNav links={links} />
        </div>

        <div className="navbar-end">{isAdminRoute && <LoginButton isLoading={isLoading} />}</div>
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
    </>
  );
}
