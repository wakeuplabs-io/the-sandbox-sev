import { useWeb3Auth } from "@/context/web3auth";
import { useGetUser } from "@/hooks/use-get-user";
import { UserRoleEnum } from "@/shared/constants";
import React, { useMemo, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";

interface WithAuthOptions {
  roles?: UserRoleEnum[];
  showStatus?: boolean;
}

interface LoadingStateProps {
  showStatus: boolean;
}

interface ErrorStateProps {
  message: string;
}

function LoadingState({ showStatus = true }: LoadingStateProps) {
  if (!showStatus) return null;
  
  return (
    <div className="text-center w-full h-screen flex items-center justify-center text-2xl font-bold text-danger">
      <FaSpinner className="animate-spin" />
    </div>
  );
}

function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="text-center w-full h-screen flex items-center justify-center text-2xl font-bold text-danger">
      {message}
    </div>
  );
}

function isValidRole(role: unknown): role is UserRoleEnum {
  return typeof role === 'string' && Object.values(UserRoleEnum).includes(role as UserRoleEnum);
}

function hasRequiredPermissions(
  isAuthenticated: boolean,
  user: { role: string } | undefined,
  requiredRoles?: UserRoleEnum[]
): boolean {
  if (!isAuthenticated) return false;
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!user || !isValidRole(user.role)) return false;
  
  return requiredRoles.includes(user.role as UserRoleEnum);
}

/**
 * HOC to protect components that require authentication
 * @param Component - Component to protect
 * @param options - Configuration options
 * @returns Component protected with authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  { roles, showStatus = true }: WithAuthOptions
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, account, email, isLoading: isAuthLoading } = useWeb3Auth();
    const { user, isLoading: isUserLoading } = useGetUser(account || "", email || "");

    const isAllowed = useMemo(() => 
      hasRequiredPermissions(isAuthenticated, user, roles),
      [isAuthenticated, user, roles]
    );

    const isLoading = useMemo(() => 
      isAuthLoading || isUserLoading,
      [isAuthLoading, isUserLoading]
    );

    const getErrorMessage = useCallback(() => 
      "Access denied",
      []
    );

    if (isLoading) {
      return <LoadingState showStatus={showStatus} />;
    }

    if (!isAllowed) {
      if (showStatus) {
        return <ErrorState message={getErrorMessage()} />;
      }
      return null;
    }

    return <Component {...props} />;
  };
}
