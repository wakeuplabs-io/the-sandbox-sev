import { PaginationInfo } from "@/shared/types"
import { TaskStateEnum } from "@/shared/constants"
import { Task, TaskExecutionProof, TaskType } from "@the-sandbox-sev/api"

export interface TaskWithProofs extends Task {
  executionProofs: TaskExecutionProof[]
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