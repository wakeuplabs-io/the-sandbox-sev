import { PaginationInfo } from "@/shared/types"
import { TaskStateEnum } from "@/shared/constants"
import { TaskType } from "@/domain/admin/tasks/new/types/tasks-new.types"

export interface Task {
  id: string
  transactionId: string
  taskType: TaskType
  state: TaskStateEnum
  taskHash: string
  transactionHash: string
  createdAt: string
  updatedAt: string
  // Otros campos que vengan de la API
  [key: string]: any
}


export interface TasksListResponse {
  tasks: Task[]
  pagination: PaginationInfo
}

export interface TasksListFilters {
  taskType?: TaskType
  state?: TaskStateEnum
  status?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  limit?: number
}

export interface TaskTableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

export interface GetPublicTasksQuery {
  page?: number
  limit?: number
  taskType?: TaskType
  search?: string
}