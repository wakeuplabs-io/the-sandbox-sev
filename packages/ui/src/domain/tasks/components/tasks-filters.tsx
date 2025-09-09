import { FaSearch } from "react-icons/fa";
import type { TasksListFilters } from "../types/tasks-list.types";
import { TaskTypeEnum, TaskStateEnum, TaskStateLabelEnum } from "@/shared/constants";
import type { SelectOption } from "@/shared/components";

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Search Transaction ID</span>
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
          <label className="label">
            <span className="label-text font-medium">Task Type</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {taskTypeOptions.map(option => (
              <button
                key={option.value}
                className={`btn btn-md ${
                  filters.taskType === option.value ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => onFiltersChange({ taskType: option.value || (undefined as any) })}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {!isPublic && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Task State</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {taskStateOptions.map(option => (
                <button
                  key={option.value}
                  className={`btn btn-md ${
                    filters.state === option.value ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => onFiltersChange({ state: option.value as any })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* <div className="flex justify-end my-4">
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
      </div> */}
    </div>
  );
}
