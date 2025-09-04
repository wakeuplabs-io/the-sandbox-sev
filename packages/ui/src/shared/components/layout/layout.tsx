import React from "react";
import { Outlet } from "@tanstack/react-router";
import { useGetUser } from "@/hooks/use-get-user";
import { useWeb3Auth } from "@/context/web3auth";
import { FaHome, FaUserShield } from "react-icons/fa";
import { Header } from "@/shared/components/layout/header";
import { Footer } from "@/shared/components/layout/footer";

interface LayoutProps {
  children?: React.ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = false }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { account, email } = useWeb3Auth();
  const { user } = useGetUser(account || "", email || "");
  console.log("user", user);
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const navigationLinks = [
    {
      to: "/",
      label: "Home",
      icon: <FaHome />,
    },
    {
      to: "/admin/tasks",
      label: "Admin",
      icon: <FaUserShield />,
    }
  ];

  return (
    <div className="min-h-screen w-screen">
      <div className="mx-auto max-w-screen-2xl">
        <Header
          links={navigationLinks}
          onSidebarToggle={handleSidebarToggle}
          showSidebarToggle={showSidebar}
        />
        <main className="flex-1 p-4 lg:p-6 ">{children || <Outlet />}</main>
        <Footer />
      </div>
    </div>
  );
}
