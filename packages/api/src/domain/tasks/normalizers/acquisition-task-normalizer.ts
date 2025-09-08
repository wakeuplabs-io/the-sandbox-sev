import { BaseTaskNormalizer } from './base-task-normalizer'
import { CreateTaskInput } from '../tasks.schema'
import { NormalizedTask } from '../tasks.service'
import { TaskType } from '@/generated/prisma'

export class AcquisitionTaskNormalizer extends BaseTaskNormalizer {
	normalize(data: CreateTaskInput, userId: string): NormalizedTask {
		this.validateTransactionId(data.transactionId)
		
		// Type assertion para acquisition task
		const acquisitionData = data as any
		
		const taskData = { taskType: TaskType.ACQUISITION, ...acquisitionData }
		const taskHash = this.hashTaskData(taskData)
		
		return {
			transactionId: acquisitionData.transactionId,
			taskType: TaskType.ACQUISITION,
			taskData,
			taskHash,
			tokenType: acquisitionData.tokenType,
			chain: acquisitionData.chain,
			platform: acquisitionData.platform,
			typeOfTx: acquisitionData.typeOfTx,
			details: acquisitionData.details,
			priority: acquisitionData.priority,
			userId,
			// Campos específicos de acquisition
			nftName: acquisitionData.nftName,
			collectionName: acquisitionData.collectionName,
			tokenId: acquisitionData.tokenId,
			targetPriceBudget: acquisitionData.targetPriceBudget,
			transactionExecutionDate: acquisitionData.transactionExecutionDate,
			priorityDeadline: acquisitionData.priorityDeadline,
		}
	}
}
