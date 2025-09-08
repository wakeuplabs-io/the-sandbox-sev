import { FaSearch, FaFilter } from "react-icons/fa";
import type { TasksListFilters } from "../types/tasks-list.types";
import { TaskTypeEnum, TaskStateEnum } from "@/shared/constants";
import { Select, type SelectOption } from "@/shared/components";

interface TasksFiltersProps {
  filters: TasksListFilters;
  onFiltersChange: (filters: Partial<TasksListFilters>) => void;
  isPublic?: boolean;
}

const taskTypeOptions: SelectOption[] = [
  { value: "", label: "All Types" },
  { value: TaskTypeEnum.LIQUIDATION, label: "Liquidation" },
  { value: TaskTypeEnum.ACQUISITION, label: "Acquisition" },
  { value: TaskTypeEnum.AUTHORIZATION, label: "Authorization" },
  { value: TaskTypeEnum.ARBITRAGE, label: "Arbitrage" },
];

const taskStateOptions: SelectOption[] = [
  { value: "", label: "All States" },
  { value: TaskStateEnum.STORED, label: "Stored" },
  { value: TaskStateEnum.EXECUTED, label: "Executed" },
  { value: TaskStateEnum.BLOCKED, label: "Blocked" },
  { value: TaskStateEnum.CANCELLED, label: "Cancelled" },
];

export function TasksFilters({ filters, onFiltersChange, isPublic }: TasksFiltersProps) {
  return (
    <div className="w-full">
      <h3 className="card-title mb-4">
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
              className="base-input w-full pl-10"
              value={filters.search || ""}
              onChange={e => onFiltersChange({ search: e.target.value })}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-4 w-4" />
          </div>
        </div>

        {/* Task State Filter */}
        {!isPublic && (
          <Select
            label="Task State"
            placeholder="All States"
            options={taskStateOptions}
            value={filters.state || ""}
            onChange={e => onFiltersChange({ state: (e.target.value as any) || undefined })}
          />
        )}

        {/* Date From */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date From</span>
          </label>
          <input
            type="date"
            className="base-input w-full"
            value={filters.dateFrom || ""}
            onChange={e => onFiltersChange({ dateFrom: e.target.value || undefined })}
          />
        </div>

        {/* Date To */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date To</span>
          </label>
          <input
            type="date"
            className="base-input w-full"
            value={filters.dateTo || ""}
            onChange={e => onFiltersChange({ dateTo: e.target.value || undefined })}
          />
        </div>
      </div>

      {/* Task Type Filter - Button List */}
      <div className="mt-6">
        <label className="label">
          <span className="label-text font-medium">Task Type</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            className={`btn btn-sm ${!filters.taskType ? "btn-primary" : "btn-outline"}`}
            onClick={() => onFiltersChange({ taskType: undefined })}
          >
            All Types
          </button>
          {taskTypeOptions.slice(1).map(option => (
            <button
              key={option.value}
              className={`btn btn-sm ${
                filters.taskType === option.value ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => onFiltersChange({ taskType: option.value as any })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="flex justify-end mt-4">
        <button
          className="btn btn-outline btn-sm"
          onClick={() =>
            onFiltersChange({
              search: undefined,
              taskType: undefined,
              state: undefined,
              dateFrom: undefined,
              dateTo: undefined,
            })
          }
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
