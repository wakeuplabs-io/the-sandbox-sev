import { BaseTaskNormalizer } from './base-task-normalizer'
import { CreateTaskInput } from '../tasks.schema'
import { NormalizedTask } from '../tasks.service'
import { TaskType } from '@/generated/prisma'

export class ArbitrageTaskNormalizer extends BaseTaskNormalizer {
	normalize(data: CreateTaskInput, userId: number): NormalizedTask {
		this.validateTransactionId(data.transactionId)
		
		// Type assertion para arbitrage task
		const arbitrageData = data as any
		
		const taskData = { taskType: TaskType.ARBITRAGE, ...arbitrageData }
		const taskHash = this.hashTaskData(taskData)
		
		return {
			transactionId: arbitrageData.transactionId,
			taskType: TaskType.ARBITRAGE,
			taskData,
			taskHash,
			tokenType: arbitrageData.tokenType,
			chain: arbitrageData.chain,
			platform: arbitrageData.platform,
			typeOfTx: arbitrageData.typeOfTx,
			details: arbitrageData.details,
			priority: arbitrageData.priority,
			userId,
			// Campos específicos de arbitrage
			targetPricePerToken: arbitrageData.targetPricePerToken,
			amount: arbitrageData.amount,
			currencyName: arbitrageData.currencyName,
			proportion: arbitrageData.proportion,
			duration: arbitrageData.duration,
			deadline: arbitrageData.deadline,
		}
	}
}
