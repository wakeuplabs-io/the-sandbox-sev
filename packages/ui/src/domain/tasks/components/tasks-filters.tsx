import { FaSearch } from "react-icons/fa";
import type { TasksListFilters } from "../types/tasks-list.types";
import { TaskTypeEnum, TaskStateEnum, TaskStateLabelEnum } from "@/shared/constants";
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
  { value: TaskStateEnum.STORED, label: TaskStateLabelEnum.STORED },
  { value: TaskStateEnum.EXECUTED, label: TaskStateLabelEnum.EXECUTED },
];

export function TasksFilters({ filters, onFiltersChange, isPublic }: TasksFiltersProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between gap-4 xl:gap-6">
        <div className="form-control col-span-1">
          <label className="label">
            <span className="label-text">Search by Tx ID / Task Hash / Tx Hash</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Transaction ID..."
              className="base-input w-full max-w-sm pl-10"
              value={filters.search || ""}
              onChange={e => onFiltersChange({ search: e.target.value })}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-4 w-4" />
          </div>
        </div>

        <div className="form-control col-span-1">
          <Select
            label="Task Type"
            placeholder="All Types"
            options={taskTypeOptions}
            value={filters.taskType || ""}
            onChange={e => onFiltersChange({ taskType: e.target.value || (undefined as any) })}
            fullWidth={false}
          />
        </div>

        {!isPublic && (
          <div className="form-control col-span-1">
            <Select
              label="Task State"
              placeholder="All States"
              options={taskStateOptions}
              value={filters.state || ""}
              onChange={e => onFiltersChange({ state: e.target.value || (undefined as any) })}
              fullWidth={false}
            />
          </div>
        )}

        {/* Date Range Filters */}
        <div className="form-control col-span-2 xl:col-span-1">
          
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col">
              <label className="text-md text-base-content/70">From</label>
              <input
                type="date"
                className="base-input text-md"
                value={filters.dateFrom || ""}
                onChange={e => onFiltersChange({ dateFrom: e.target.value || undefined })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md text-base-content/70">To</label>
              <input
                type="date"
                className="base-input text-md"
                value={filters.dateTo || ""}
                onChange={e => onFiltersChange({ dateTo: e.target.value || undefined })}
              />
            </div>
          </div>
        </div>
      </div>

       <div className="flex justify-end my-4">
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
