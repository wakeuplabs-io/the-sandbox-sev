import { BaseTaskNormalizer } from './base-task-normalizer'
import { CreateTaskInput } from '../tasks.schema'
import { NormalizedTask } from '../tasks.service'
import { TaskType } from '@/generated/prisma'

export class VaultTaskNormalizer extends BaseTaskNormalizer {
	normalize(data: CreateTaskInput, userId: number): NormalizedTask {
		this.validateTransactionId(data.transactionId)
		
		// Type assertion para vault task
		const vaultData = data as any
		
		const taskData = { taskType: TaskType.VAULT, ...vaultData }
		const taskHash = this.hashTaskData(taskData)
		
		return {
			transactionId: vaultData.transactionId,
			taskType: TaskType.VAULT,
			taskData,
			taskHash,
			tokenType: vaultData.tokenType || null,
			chain: vaultData.chain || null,
			platform: vaultData.platform || null,
			typeOfTx: vaultData.typeOfTx,
			details: vaultData.details || null,
			priority: vaultData.priority || null,
			userId,
			// Campos específicos de vault
			companyAndArtist: vaultData.companyAndArtist,
			collectionName: vaultData.collectionName,
			tokenId: vaultData.tokenId,
			technicalVerification: vaultData.technicalVerification,
		}
	}
}
