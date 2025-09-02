import { PaginationInfo } from "@/shared/types"
import { TaskType } from "./tasks-new.types"
import { TaskStateEnum } from "@/shared/constants"

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
