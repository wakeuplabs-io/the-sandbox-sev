import { TaskTypeEnum } from '@/shared/constants'
import type { TaskType } from '@the-sandbox-sev/api'

export function useTaskTypeColors() {
  const getTaskTypeBadgeClasses = (taskType: TaskType) => {
    return {
      'badge-outline badge-error': taskType === TaskTypeEnum.LIQUIDATION,
      'badge-outline badge-success': taskType === TaskTypeEnum.ACQUISITION,
      'badge-outline badge-warning': taskType === TaskTypeEnum.AUTHORIZATION,
      'badge-outline badge-info': taskType === TaskTypeEnum.ARBITRAGE,
      'badge-outline badge-neutral': !Object.values(TaskTypeEnum).includes(taskType as TaskTypeEnum),
    }
  }

  const getTaskTypeColor = (taskType: TaskType): string => {
    switch (taskType) {
      case TaskTypeEnum.LIQUIDATION:
        return 'error'
      case TaskTypeEnum.ACQUISITION:
        return 'success'
      case TaskTypeEnum.AUTHORIZATION:
        return 'warning'
      case TaskTypeEnum.ARBITRAGE:
        return 'info'
      default:
        return 'neutral'
    }
  }

  return {
    getTaskTypeBadgeClasses,
    getTaskTypeColor,
  }
}
