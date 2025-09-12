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

/**
 * Componente para mostrar estado de carga
 */
function LoadingState({ showStatus }: LoadingStateProps) {
  if (!showStatus) return null;
  
  return (
    <div className="text-center w-full h-screen flex items-center justify-center text-2xl font-bold text-danger">
      <FaSpinner className="animate-spin" />
    </div>
  );
}

/**
 * Componente para mostrar estado de error/permisos
 */
function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="text-center w-full h-screen flex items-center justify-center text-2xl font-bold text-danger">
      {message}
    </div>
  );
}

/**
 * Type guard para verificar si un rol es válido
 */
function isValidRole(role: unknown): role is UserRoleEnum {
  return typeof role === 'string' && Object.values(UserRoleEnum).includes(role as UserRoleEnum);
}

/**
 * Verifica si el usuario tiene los permisos necesarios
 */
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
 * HOC para proteger componentes que requieren autenticación
 * @param Component - Componente a proteger
 * @param options - Opciones de configuración
 * @returns Componente protegido con autenticación
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: WithAuthOptions
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, account, email, isLoading: isAuthLoading } = useWeb3Auth();
    const { user, isLoading: isUserLoading } = useGetUser(account || "", email || "");

    // Memoizar el cálculo de permisos para evitar re-renders innecesarios
    const isAllowed = useMemo(() => 
      hasRequiredPermissions(isAuthenticated, user, options?.roles),
      [isAuthenticated, user, options?.roles]
    );

    // Memoizar el estado de loading
    const isLoading = useMemo(() => 
      isAuthLoading || isUserLoading,
      [isAuthLoading, isUserLoading]
    );

    // Callback para el mensaje de error
    const getErrorMessage = useCallback(() => 
      "No tienes permisos para acceder a esta página",
      []
    );

    // Guard clause: si el contexto no está listo, mostrar loading
    if (isLoading) {
      return <LoadingState showStatus={options?.showStatus ?? false} />;
    }

    // Guard clause: si no está autenticado o no tiene permisos
    if (!isAllowed) {
      if (options?.showStatus) {
        return <ErrorState message={getErrorMessage()} />;
      }
      return null;
    }

    return <Component {...props} />;
  };
}
