import { TASK_TYPE_CONFIGS } from "../types/tasks-new.types";
import { TaskType } from "@the-sandbox-sev/api";

interface TaskTypeInfoProps {
  taskType: TaskType;
}

export function TaskTypeInfo({ taskType }: TaskTypeInfoProps) {
  const config = TASK_TYPE_CONFIGS[taskType];

  return (
    <div className="">
      <p className="card-title font-normal">
        Paste the selected columns for <strong>{config.name}</strong> tasks:
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {config.columns.map(column => (
          <span key={column} className="px-2 py-1 bg-base-200 rounded text-xs font-mono">
            {column}
          </span>
        ))}
      </div>
    </div>
  );
}
