import { TaskTypeEnum } from '@/shared/constants'
import type { TaskType } from '@/domain/admin/tasks/types/tasks-new.types'

export function useTaskTypeColors() {
  const getTaskTypeBadgeClasses = (taskType: TaskType) => {
    return {
      'badge-error': taskType === TaskTypeEnum.LIQUIDATION,
      'badge-success': taskType === TaskTypeEnum.ACQUISITION,
      'badge-warning': taskType === TaskTypeEnum.AUTHORIZATION,
      'badge-info': taskType === TaskTypeEnum.ARBITRAGE,
      'badge-neutral': !Object.values(TaskTypeEnum).includes(taskType as TaskTypeEnum),
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
