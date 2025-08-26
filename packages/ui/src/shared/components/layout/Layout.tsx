import React from "react";
import { Outlet } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useGetUser } from "@/hooks/use-get-user";
import { useWeb3Auth } from "@/context/web3auth";

interface LayoutProps {
  children?: React.ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = false }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { account, email } = useWeb3Auth();
  const { user, isLoading, isError } = useGetUser(account || "", email || "");
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  console.log(user);
  // Navigation links configuration with icons
  const navigationLinks = [
    {
      to: "/",
      label: "Home",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      to: "/about",
      label: "About",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    // Add more navigation links here as needed
  ];

  return (
    <div className="min-h-screen w-screen">
      <div className="mx-auto max-w-screen-2xl">
        {/* Header */}
        <Header
          links={navigationLinks}
          onSidebarToggle={handleSidebarToggle}
          showSidebarToggle={showSidebar}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 ">{children || <Outlet />}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
