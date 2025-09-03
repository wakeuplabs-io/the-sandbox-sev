import { useApiClient } from "./use-api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { TasksListFilters } from "@/domain/admin/tasks/types/tasks-list.types";
import { useWeb3Auth } from "@/context/web3auth";

export const useTasks = () => {
  const client = useApiClient();
const { isAuthenticated, isInitialized } = useWeb3Auth();
  const createTask = useMutation({
    mutationFn: async (taskData: any) => {
      const response = await client.api.tasks.$post({
        json: taskData,
      });

      if (!response.ok) {
        const error: any = await response.json();
        throw new Error(error?.error || "Failed to create task");
      }

      return response.json();
    },
  });

  const getAllTasks = (filters: TasksListFilters) => {
    return useQuery({
      queryKey: ["tasks", filters],
      enabled: isAuthenticated && isInitialized,
      queryFn: async () => {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', filters.page?.toString() || '1');
        params.append('limit', filters.limit?.toString() || '10');
        
        if (filters.taskType) {
          params.append('taskType', filters.taskType);
        }
        
        if (filters.search) {
          params.append('search', filters.search);
        }
        
        if (filters.dateFrom) {
          params.append('dateFrom', filters.dateFrom);
        }
        
        if (filters.dateTo) {
          params.append('dateTo', filters.dateTo);
        }
        
        if (filters.status) {
          params.append('status', filters.status);
        }
        
        if (filters.state) {
          params.append('state', filters.state);
        }

        const response = await client.api.tasks.$get({
          query: Object.fromEntries(params),
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        
        return response.json();
      }
    });
  };

  const getTaskByTransactionId = (transactionId: string) => {
    return useQuery({
      queryKey: ["task", transactionId],
      queryFn: async () => {
        const response = await client.api.tasks[":transactionId"].$get({
          param: { transactionId },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }
        
        return response.json();
      },
      enabled: !!transactionId,
    });
  };

  return {
    createTask,
    getAllTasks,
    getTaskByTransactionId,
  };
};
