import { TaskTypeEnum } from '@/shared/constants';
import { TaskType } from '../types/tasks-new.types'

interface TaskTypeButtonsProps {
  selectedType: TaskType | null
  onTypeChange: (type: TaskType) => void
}

export function TaskTypeButtons({ selectedType, onTypeChange }: TaskTypeButtonsProps) {
  const taskTypes: { type: TaskType; label: string; description: string }[] = [
    {
      type: TaskTypeEnum.LIQUIDATION,
      label: 'Liquidation',
      description: 'Liquidate assets'
    },
    {
      type: TaskTypeEnum.ACQUISITION,
      label: 'Acquisition',
      description: 'Acquire new assets'
    },
    {
      type: TaskTypeEnum.AUTHORIZATION,
      label: 'Authorization',
      description: 'Authorize transactions'
    },
    {
      type: TaskTypeEnum.ARBITRAGE,
      label: 'Arbitrage',
      description: 'Arbitrage opportunities'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {taskTypes.map(({ type, label, description }) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`
            p-4 rounded-lg border-2 transition-all duration-200
            ${selectedType === type
              ? 'border-primary bg-primary text-primary-content shadow-lg'
              : 'border-base-300 bg-base-100 hover:border-primary hover:shadow-md'
            }
          `}
        >
          <div className="text-center">
            <div className="font-semibold text-lg">{label}</div>
            <div className={`text-sm mt-1 ${
              selectedType === type ? 'text-primary-content/80' : 'text-base-content/60'
            }`}>
              {description}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
