import { BaseTaskNormalizer } from './base-task-normalizer'
import { CreateTaskInput } from '../tasks.schema'
import { NormalizedTask } from '../tasks.service'
import { TaskType } from '@/generated/prisma'

export class LiquidationTaskNormalizer extends BaseTaskNormalizer {
	normalize(data: CreateTaskInput, userId: number): NormalizedTask {
		this.validateTransactionId(data.transactionId)
		
		// Type assertion para liquidation task
		const liquidationData = data as any
		
		const taskData = { taskType: TaskType.LIQUIDATION, ...liquidationData }
		const taskHash = this.hashTaskData(taskData)
		
		return {
			transactionId: liquidationData.transactionId,
			taskType: TaskType.LIQUIDATION,
			taskData,
			taskHash,
			tokenType: liquidationData.tokenType,
			chain: liquidationData.chain,
			platform: liquidationData.platform,
			typeOfTx: liquidationData.typeOfTx,
			details: liquidationData.details,
			priority: liquidationData.priority,
			userId,
			// Campos específicos de liquidation
			companyAndArtist: liquidationData.companyAndArtist,
			collectionName: liquidationData.collectionName,
			tokenId: liquidationData.tokenId,
			targetPriceEth: liquidationData.targetPriceEth,
			dateDeadline: liquidationData.dateDeadline,
			tokenLink: liquidationData.tokenLink,
		}
	}
}
