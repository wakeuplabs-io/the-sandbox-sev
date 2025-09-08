import { useWeb3Auth } from "@/context/web3auth";
import { useState } from "react";
import { Avatar } from "./avatar";
import { useGetUser } from "@/hooks/use-get-user";
import { useLayout } from "@/context/layout-context";

function SkeletonButton() {
  return (
    <div className="btn btn-outline bg-primary/50 animate-pulse">
      <span className="">Iniciando sesión</span>
    </div>
  );
}

export const LoginButton = ({ isLoading: isLoadingUser }: { isLoading: boolean }) => {
  const {
    isLoading: isLoadingWeb3Auth,
    isInitialized,
    isAuthenticated,
    login,
    logout,
    user: web3AuthUser,
    account,
  } = useWeb3Auth();
  const [error, setError] = useState<string | null>(null);
  const { setIsProfileModalOpen } = useLayout();
  const { user: apiUser } = useGetUser(account || "", web3AuthUser?.email || "");

  const isLoading = isLoadingUser || isLoadingWeb3Auth;
  const handleLogin = async () => {
    if (!isInitialized) {
      console.log("Web3Auth is not initialized yet");
      return;
    }

    setError(null);
    try {
      await login();
    } catch (e: unknown) {
      console.error("Login error:", e);
      setError(e instanceof Error ? e.message : "Error al conectar");
    }
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  if (!isInitialized) {
    return <SkeletonButton />;
  }

  if (isLoading) {
    return <SkeletonButton />;
  }

  if (!isAuthenticated) {
    return (
      <button onClick={handleLogin} disabled={isLoading} className="btn btn-outline">
        {"Login"}
      </button>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm mt-2">{error}</div>;
  }

  return (
    <>
      <Avatar name={apiUser?.nickname || apiUser?.email || ""} onClick={handleProfileClick} />
    </>
  );
};
