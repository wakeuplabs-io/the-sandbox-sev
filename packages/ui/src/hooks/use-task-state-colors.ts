import { TaskStateEnum } from "@/shared/constants";

export function useTaskStateColors() {
  const getTaskStateBadgeClasses = (state: TaskStateEnum) => {
    switch (state) {
      case TaskStateEnum.STORED: return "badge-primary badge-sm";
      case TaskStateEnum.EXECUTED: return "badge-success badge-sm";
      case TaskStateEnum.BLOCKED: return "badge-error badge-sm";
      case TaskStateEnum.CANCELLED: return "badge-warning badge-sm";
      default: return "badge-neutral badge-sm";
    }
  };

  const getTaskStateColor = (state: TaskStateEnum) => {
    switch (state) {
      case TaskStateEnum.STORED: return "primary";
      case TaskStateEnum.EXECUTED: return "success";
      case TaskStateEnum.BLOCKED: return "error";
      case TaskStateEnum.CANCELLED: return "warning";
      default: return "neutral";
    }
  };

  return { getTaskStateBadgeClasses, getTaskStateColor };
}
