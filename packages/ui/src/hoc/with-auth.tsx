import { useWeb3Auth } from "@/context/web3auth";
import { useGetUser } from "@/hooks/use-get-user";
import { UserRoleEnum } from "@/shared/constants";
import React from "react";
import { FaSpinner } from "react-icons/fa";

interface WithAuthOptions {
  roles?: UserRoleEnum[];
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: WithAuthOptions
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, account, email, isLoading: isAuthLoading } = useWeb3Auth();
    const { user, isLoading: isUserLoading } = useGetUser(account || "", email || "");

    const roles = options?.roles;
    const isAllowed =
      isAuthenticated && (!roles || (user && roles.includes(user.role as UserRoleEnum)));

    // Guard clause: si el contexto no está listo, mostrar loading
    if (isAuthLoading || isUserLoading) {
      return (
        <div className="text-center w-full h-screen flex items-center justify-center text-2xl font-bold text-danger">
          <FaSpinner className="animate-spin" />
        </div>
      );
    }

    // Guard clause: si no está autenticado, no renderizar el componente
    if (!isAllowed) {
      return (
        <div className="text-center w-full h-screen flex items-center justify-center text-2xl font-bold text-danger">
          No tienes permisos para acceder a esta página
        </div>
      );
    }

    return <Component {...props} />;
  };
}
