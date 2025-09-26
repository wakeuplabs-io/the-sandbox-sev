import { FaSearch } from "react-icons/fa";
import type { TasksListFilters } from "../types/tasks-list.types";
import { TaskTypeEnum, TaskStateEnum, TaskStateLabelEnum, TaskPriorityEnum, TaskPriorityLabelEnum } from "@/shared/constants";
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
  { value: TaskTypeEnum.VAULT, label: "Vault" },
];

const taskStateOptions: SelectOption[] = [
  { value: "", label: "All States" },
  { value: TaskStateEnum.STORED, label: TaskStateLabelEnum.STORED },
  { value: TaskStateEnum.EXECUTED, label: TaskStateLabelEnum.EXECUTED },
];

const taskPriorityOptions: SelectOption[] = [
  { value: "", label: "All Priorities" },
  { value: TaskPriorityEnum.SUPER_HIGH, label: TaskPriorityLabelEnum.SUPER_HIGH },
  { value: TaskPriorityEnum.HIGH, label: TaskPriorityLabelEnum.HIGH },
  { value: TaskPriorityEnum.HIGH_24H, label: TaskPriorityLabelEnum.HIGH_24H },
  { value: TaskPriorityEnum.MEDIUM, label: TaskPriorityLabelEnum.MEDIUM },
  { value: TaskPriorityEnum.MEDIUM_48H, label: TaskPriorityLabelEnum.MEDIUM_48H },
  { value: TaskPriorityEnum.LOW, label: TaskPriorityLabelEnum.LOW },
  { value: TaskPriorityEnum.LOW_72H, label: TaskPriorityLabelEnum.LOW_72H },
];

export function TasksFilters({ filters, onFiltersChange, isPublic }: TasksFiltersProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-start gap-4 xl:gap-10 my-10">
        <div className="form-control">
          <label className="label text-xs">
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

        <div className="form-control">
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
          <div className="form-control">
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

        {!isPublic && (
          <div className="form-control">
            <Select
              label="Priority"
              placeholder="All Priorities"
              options={taskPriorityOptions}
              value={filters.priority || ""}
              onChange={e => onFiltersChange({ priority: e.target.value || (undefined as any) })}
              fullWidth={false}
            />
          </div>
        )}

        {/* Date Range Filters */}
        <div className="form-control">
          <label className="label text-xs">
            <span className="label-text">From</span>
          </label>
          <input
            type="date"
            className="base-input text-md"
            value={filters.dateFrom || ""}
            onChange={e => onFiltersChange({ dateFrom: e.target.value || undefined })}
          />
        </div>
        <div className="form-control">
          <label className="label text-xs">
            <span className="label-text">To</span>
          </label>
          <input
            type="date"
            className="base-input text-md"
            value={filters.dateTo || ""}
            onChange={e => onFiltersChange({ dateTo: e.target.value || undefined })}
          />
        </div>

        <div className="flex flex-col justify-end">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() =>
              onFiltersChange({
                search: undefined,
                taskType: undefined,
                state: undefined,
                priority: undefined,
                dateFrom: undefined,
                dateTo: undefined,
              })
            }
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
