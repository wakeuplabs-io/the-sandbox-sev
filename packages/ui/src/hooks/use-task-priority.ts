import { FaExclamationTriangle, FaClock } from 'react-icons/fa'

export function useTaskPriority() {
  const getPriorityIcon = (priority?: string) => {
    if (!priority) return null
    
    if (priority.toLowerCase().includes('high')) {
      return FaExclamationTriangle
    } else if (priority.toLowerCase().includes('medium')) {
      return FaClock
    }
    return FaClock
  }

  const getPriorityIconClass = (priority?: string) => {
    if (!priority) return 'h-4 w-4 text-base-content/60'
    
    if (priority.toLowerCase().includes('high')) {
      return 'h-4 w-4 text-error'
    } else if (priority.toLowerCase().includes('medium')) {
      return 'h-4 w-4 text-warning'
    }
    return 'h-4 w-4 text-info'
  }

  const getPriorityBadgeClasses = (priority?: string) => {
    if (!priority) return 'badge-neutral badge-sm'
    
    if (priority.toLowerCase().includes('high')) {
      return 'badge-error badge-sm border-2 border-error/20'
    } else if (priority.toLowerCase().includes('medium')) {
      return 'badge-warning badge-sm border-2 border-warning/20'
    }
    return 'badge-info badge-sm border-2 border-info/20'
  }

  const getPriorityTextColor = (priority?: string) => {
    if (!priority) return 'text-base-content/60'
    
    if (priority.toLowerCase().includes('high')) {
      return 'text-error'
    } else if (priority.toLowerCase().includes('medium')) {
      return 'text-warning'
    }
    return 'text-info'
  }

  return {
    getPriorityIcon,
    getPriorityIconClass,
    getPriorityBadgeClasses,
    getPriorityTextColor,
  }
}
