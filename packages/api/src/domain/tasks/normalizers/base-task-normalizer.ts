import { CreateTaskInput } from '../tasks.schema'
import { NormalizedTask } from '../tasks.service'
import { TaskType } from '@/generated/prisma'
import { keccak256, stringToHex } from 'viem'

export abstract class BaseTaskNormalizer {
	abstract normalize(data: CreateTaskInput, userId: string): NormalizedTask
	
	protected hashTaskData(taskData: any): string {
		const jsonString = JSON.stringify(taskData, Object.keys(taskData).sort())
		return keccak256(stringToHex(jsonString))
	}
	
	protected validateTransactionId(transactionId: string): void {
		if (!transactionId || transactionId.trim() === '') {
			throw new Error('Transaction ID is required')
		}
	}
}
