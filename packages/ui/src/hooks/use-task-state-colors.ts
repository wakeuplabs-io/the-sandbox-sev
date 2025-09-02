import { TaskStateEnum } from "@/shared/constants";

export function useTaskStateColors() {
  const getTaskStateBadgeClasses = (state: TaskStateEnum) => {
    switch (state) {
      case TaskStateEnum.STORED: return "badge-info";
      case TaskStateEnum.EXECUTED: return "badge-success";
      case TaskStateEnum.BLOCKED: return "badge-error";
      case TaskStateEnum.CANCELLED: return "badge-warning";
      default: return "badge-neutral";
    }
  };

  const getTaskStateColor = (state: TaskStateEnum) => {
    switch (state) {
      case TaskStateEnum.STORED: return "info";
      case TaskStateEnum.EXECUTED: return "success";
      case TaskStateEnum.BLOCKED: return "error";
      case TaskStateEnum.CANCELLED: return "warning";
      default: return "neutral";
    }
  };

  return { getTaskStateBadgeClasses, getTaskStateColor };
}
