import { PaginationInfo } from "@/shared/types"

export interface Task {
  id: string
  transactionId: string
  taskType: 'LIQUIDATION' | 'ACQUISITION' | 'AUTHORIZATION' | 'ARBITRAGE'
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

export interface TasksFilters {
  taskType?: 'LIQUIDATION' | 'ACQUISITION' | 'AUTHORIZATION' | 'ARBITRAGE'
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
