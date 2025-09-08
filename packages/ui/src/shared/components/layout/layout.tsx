import React, { useMemo } from "react";
import { Outlet } from "@tanstack/react-router";
import { useGetUser } from "@/hooks/use-get-user";
import { useWeb3Auth } from "@/context/web3auth";
import { useNicknameSetup } from "@/hooks/use-nickname-setup";
import { FaUser, FaUserShield } from "react-icons/fa";
import { Header } from "@/shared/components/layout/header";
import { Footer } from "@/shared/components/layout/footer";
import { NicknameSetupModal } from "@/shared/components/nickname-setup-modal";
import { UserRoleEnum } from "@/shared/constants";

interface LayoutProps {
  children?: React.ReactNode;
  showSidebar?: boolean;
}

const nlinks = [
  {
    to: "/admin/tasks",
    label: "Tasks",
    icon: <FaUserShield />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.CONSULTANT],
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: <FaUser />,
    roles: [UserRoleEnum.ADMIN],
  },
];

export function Layout({ children, showSidebar = false }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { account, email } = useWeb3Auth();
  const { user } = useGetUser(account || "", email || "");
  const { shouldShowModal, updateNickname, isUpdating, error } = useNicknameSetup();
  
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const navigationLinks = useMemo(() => {
        return nlinks.filter((link) => link.roles.length === 0 || link.roles.includes(user?.role as UserRoleEnum));
  }, [user]);

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
      
      {/* Nickname Setup Modal */}
      <NicknameSetupModal
        isOpen={shouldShowModal}
        user={user}
        onSave={updateNickname}
        isUpdating={isUpdating}
        error={error}
      />
    </div>
  );
}
