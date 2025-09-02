import { FaSearch, FaFilter } from 'react-icons/fa'
import type { TasksFilters } from '../types/tasks-list.types'
import { TaskTypeEnum } from '@/shared/constants'

interface TasksFiltersProps {
  filters: TasksFilters
  onFiltersChange: (filters: Partial<TasksFilters>) => void
}

export function TasksFilters({ filters, onFiltersChange}: TasksFiltersProps) {
  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h3 className="card-title">
          <FaFilter className="h-5 w-5" />
          Filters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search by Transaction ID */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search Transaction ID</span>
              
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Transaction ID..."
                className="input input-bordered w-full pl-10"
                value={filters.search || ''}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-4 w-4" />
            </div>
            {filters.search && (
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Search will trigger after 500ms of no typing
                </span>
              </label>
            )}
          </div>

          {/* Task Type Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Task Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={filters.taskType || ''}
              onChange={(e) => onFiltersChange({ taskType: e.target.value as any || undefined })}
            >
              <option value="">All Types</option>
              <option value={TaskTypeEnum.LIQUIDATION}>Liquidation</option>
              <option value={TaskTypeEnum.ACQUISITION}>Acquisition</option>
              <option value={TaskTypeEnum.AUTHORIZATION}>Authorization</option>
              <option value={TaskTypeEnum.ARBITRAGE}>Arbitrage</option>
            </select>
          </div>

          {/* Date From */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date From</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={filters.dateFrom || ''}
              onChange={(e) => onFiltersChange({ dateFrom: e.target.value || undefined })}
            />
          </div>

          {/* Date To */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date To</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={filters.dateTo || ''}
              onChange={(e) => onFiltersChange({ dateTo: e.target.value || undefined })}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end mt-4">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onFiltersChange({
              search: undefined,
              taskType: undefined,
              dateFrom: undefined,
              dateTo: undefined,
            })}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}
