import { BaseTaskNormalizer } from './base-task-normalizer'
import { CreateTaskInput } from '../tasks.schema'
import { NormalizedTask } from '../tasks.service'
import { TaskType } from '@/generated/prisma'

export class AuthorizationTaskNormalizer extends BaseTaskNormalizer {
	normalize(data: CreateTaskInput, userId: number): NormalizedTask {
		this.validateTransactionId(data.transactionId)
		
		// Type assertion para authorization task
		const authorizationData = data as any
		
		const taskData = { taskType: TaskType.AUTHORIZATION, ...authorizationData }
		const taskHash = this.hashTaskData(taskData)
		
		return {
			transactionId: authorizationData.transactionId,
			taskType: TaskType.AUTHORIZATION,
			taskData,
			taskHash,
			tokenType: authorizationData.tokenType,
			chain: authorizationData.chain,
			platform: authorizationData.platform,
			typeOfTx: authorizationData.typeOfTx,
			details: authorizationData.details,
			priority: authorizationData.priority,
			userId,
			// Campos específicos de authorization
			collectionName: authorizationData.collectionName,
			tokenId: authorizationData.tokenId,
			targetPriceBudget: authorizationData.targetPriceBudget,
			dateDeadline: authorizationData.dateDeadline,
		}
	}
}
