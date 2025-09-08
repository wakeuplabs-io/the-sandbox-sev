import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { MobileMenu } from "./mobile-menu";
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
  const { isLoading, isMobileMenuOpen, setIsMobileMenuOpen } = useLayout();
  const routerState = useRouterState();
  
  // Check if current pathname starts with /admin
  const isAdminRoute = routerState.location.pathname.startsWith('/admin');
  
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300 shadow-lg px-4">
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

      <div className="navbar-end">
        {isAdminRoute && <LoginButton isLoading={isLoading} />}
      </div>

      <div className="navbar-end lg:hidden">
        <MobileMenu isOpen={isMobileMenuOpen} onToggle={handleMobileMenuToggle} links={links} />
      </div>
    </div>
  );
}
