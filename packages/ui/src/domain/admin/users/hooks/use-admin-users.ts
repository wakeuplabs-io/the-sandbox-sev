import { useState, useEffect, useCallback } from "react";
import { useLayout } from "@/context/layout-context";
import { toast } from "react-toastify";
import { useGetUsers } from "@/hooks/use-get-users";
import { useApiClient } from "@/hooks/use-api-client";
import { useWeb3Auth } from "@/context/web3auth";
import { User, UserWithChanges } from "../types";
import { UserRoleEnum } from "@/shared/constants";

export function useAdminUsers() {
  const apiClient = useApiClient();
  const { setIsLoading } = useLayout();
  const { user: currentUser } = useWeb3Auth();
  
  // Estado local para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  
  // Usar el hook existente para obtener usuarios
  const { 
    users: apiUsers, 
    pagination: apiPagination, 
    isLoading: isLoadingUsers, 
    error: apiError,
    refetch 
  } = useGetUsers(currentPage, currentLimit);
  
  // Estado local para usuarios modificados
  const [modifiedUsers, setModifiedUsers] = useState<UserWithChanges[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Función para verificar si un usuario es el usuario actual
  const isCurrentUser = useCallback((user: User) => {
    if (!currentUser || !user.email) return false;
    return currentUser.email === user.email;
  }, [currentUser]);

  // Transformar usuarios de la API a usuarios con cambios
  useEffect(() => {
    if (apiUsers && apiUsers.length > 0) {
      setModifiedUsers(prevUsers => {
        // Si ya tenemos usuarios modificados, mantener sus cambios
        if (prevUsers.length > 0) {
          return apiUsers.map((apiUser: User) => {
            const existingUser = prevUsers.find(u => u.id === apiUser.id);
            if (existingUser && existingUser.hasChanges) {
              // Mantener el usuario modificado
              return existingUser;
            } else {
              // Crear nuevo usuario con estado inicial
              return {
                ...apiUser,
                originalRole: apiUser.role,
                hasChanges: false,
              };
            }
          });
        } else {
          // Primera carga, crear usuarios con estado inicial
          return apiUsers.map((user: User) => ({
            ...user,
            originalRole: user.role,
            hasChanges: false,
          }));
        }
      });
    }
  }, [apiUsers]);

  // Manejar errores de la API
  useEffect(() => {
    if (apiError) {
      setError(apiError instanceof Error ? apiError : new Error("Unknown error"));
      toast.error("Failed to load users");
    }
  }, [apiError]);

  // Cambiar rol de un usuario
  const changeUserRole = useCallback((userId: number, newRole: UserRoleEnum) => {
    console.log("changeUserRole", userId, newRole);
    setModifiedUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              role: newRole, 
              hasChanges: newRole !== user.originalRole 
            }
          : user
      );
      
      console.log("Updated users:", updatedUsers);
      console.log("User with changes:", updatedUsers.find(u => u.id === userId));
      console.log("Has changes:", updatedUsers.some(u => u.hasChanges));
      
      return updatedUsers;
    });
  }, []);

  // Verificar si hay cambios pendientes
  const hasChanges = modifiedUsers.some(user => user.hasChanges);
  
  console.log("Current hasChanges:", hasChanges);
  console.log("Modified users:", modifiedUsers);

  // Guardar cambios
  const saveChanges = useCallback(async () => {
    if (!hasChanges) return;
    
    try {
      setIsSaving(true);
      
      const changes = modifiedUsers
        .filter(user => user.hasChanges)
        .map(user => ({
          userId: user.id,
          role: user.role,
        }));
      
      const response = await apiClient.api.users.roles.assign.$post({
        json: { assignments: changes }
      });
      
      if (!response.ok) {
        throw new Error("Failed to save role changes");
      }
      
      // Actualizar estado local
      setModifiedUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          originalRole: user.role,
          hasChanges: false,
        }))
      );
      
      toast.success("Role changes saved successfully");
      
      // Recargar usuarios para asegurar sincronización
      refetch();
    } catch (err) {
      toast.error("Failed to save role changes");
      console.error("Error saving roles:", err);
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, modifiedUsers, apiClient, refetch]);

  // Cambiar página
  const loadUsers = useCallback((page: number, limit: number = 10) => {
    setCurrentPage(page);
    setCurrentLimit(limit);
  }, []);

  // Usar el loading state del contexto global
  useEffect(() => {
    setIsLoading(isLoadingUsers);
  }, [isLoadingUsers, setIsLoading]);

  return {
    users: modifiedUsers,
    pagination: apiPagination,
    error,
    isLoading: isLoadingUsers,
    isSaving,
    hasChanges,
    changeUserRole,
    saveChanges,
    loadUsers,
    isCurrentUser,
  };
}
