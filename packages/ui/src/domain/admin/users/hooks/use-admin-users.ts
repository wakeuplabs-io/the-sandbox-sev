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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  
  const { 
    users: apiUsers, 
    pagination: apiPagination, 
    isLoading: isLoadingUsers, 
    error: apiError,
    refetch 
  } = useGetUsers(currentPage, currentLimit);
  
  const [modifiedUsers, setModifiedUsers] = useState<UserWithChanges[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isCurrentUser = useCallback((user: User) => {
    if (!currentUser || !user.email) return false;
    return currentUser.email === user.email;
  }, [currentUser]);

  useEffect(() => {
    if (apiUsers && apiUsers.length > 0) {
      setModifiedUsers(prevUsers => {
        if (prevUsers.length > 0) {
          return apiUsers.map((apiUser: User) => {
            const existingUser = prevUsers.find(u => u.id === apiUser.id);
            if (existingUser && existingUser.hasChanges) {
              return existingUser;
            } else {
              return {
                ...apiUser,
                originalRole: apiUser.role,
                hasChanges: false,
              };
            }
          });
        } else {
          return apiUsers.map((user: User) => ({
            ...user,
            originalRole: user.role,
            hasChanges: false,
          }));
        }
      });
    }
  }, [apiUsers]);

  useEffect(() => {
    if (apiError) {
      setError(apiError instanceof Error ? apiError : new Error("Unknown error"));
      toast.error("Failed to load users");
    }
  }, [apiError]);

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
      
      return updatedUsers;
    });
  }, []);

  const hasChanges = modifiedUsers.some(user => user.hasChanges);
  

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
      
      setModifiedUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          originalRole: user.role,
          hasChanges: false,
        }))
      );
      
      toast.success("Role changes saved successfully");
      
      refetch();
    } catch (err) {
      toast.error("Failed to save role changes");
      console.error("Error saving roles:", err);
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, modifiedUsers, apiClient, refetch]);

  const loadUsers = useCallback((page: number, limit: number = 10) => {
    setCurrentPage(page);
    setCurrentLimit(limit);
  }, []);

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
