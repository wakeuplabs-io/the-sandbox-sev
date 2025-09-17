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
import { ProfileModal } from "./profile-modal";
import { useLayout } from "@/context/layout-context";
import { WalletBalanceBanner } from "./wallet-balance-banner";

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
  const { account, email, logout } = useWeb3Auth();
  const { user } = useGetUser(account || "", email || "");
  const { shouldShowModal, updateNickname, isUpdating, error } = useNicknameSetup();
  const { isProfileModalOpen, setIsProfileModalOpen, isWalletBalanceModalOpen, setIsWalletBalanceModalOpen } = useLayout();
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleProfileModalClose = () => {
    setIsProfileModalOpen(false);
  };
  const handleLogout = async () => {
    await logout();
  };
  const navigationLinks = useMemo(() => {
    return nlinks.filter(
      link => link.roles.length === 0 || link.roles.includes(user?.role as UserRoleEnum)
    );
  }, [user]);

  return (
    <div className="min-h-screen w-screen">
      <Header
        links={navigationLinks}
        onSidebarToggle={handleSidebarToggle}
        showSidebarToggle={showSidebar}
      />
      <div className="mx-auto max-w-screen-2xl min-h-[calc(100vh-250px)] pt-16">
        <main className="flex-1 py-6">{children || <Outlet />}</main>
      </div>
      <Footer />

      {/* Nickname Setup Modal */}
      <NicknameSetupModal
        isOpen={shouldShowModal}
        user={user}
        onSave={updateNickname}
        isUpdating={isUpdating}
        error={error}
      />
       {/* Profile Modal */}
       <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleProfileModalClose}
        user={user || null}
        onLogout={handleLogout}
        isLoggingOut={false}
      />
      <WalletBalanceBanner onClose={() => {
        console.log("close");
        setIsWalletBalanceModalOpen(false);
      }} isOpen={isWalletBalanceModalOpen} />
    </div>
  );
}
