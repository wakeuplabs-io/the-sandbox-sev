import { Context } from 'hono'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { createTask, getAllTasks, getTaskByTransactionId } from './tasks.service'
import { getUserAddress } from '@/middlewares/auth'
import { getPublicHttpsClient, getWalletHttpsClient } from '@/services/wallet-clients'
import { VerifierService } from '@/services/verifier-service'
import env from '@/env'

export const createTaskController = async (c: Context): Promise<Response> => {
  try {
    // Get user address from context
    const userAddress = getUserAddress(c)
    if (!userAddress) {
      return c.json({ error: 'User not authenticated' }, 401)
    }

    // Parse request body
    const body = await c.req.json()

    // Create VerifierService instance
    const verifierService = new VerifierService({
      contractAddress: env.EXECUTION_VERIFIER_ADDRESS as any,
      publicClient: getPublicHttpsClient(),
      walletClient: getWalletHttpsClient(),
    })

    // Create task
    const task = await createTask(body, userAddress, verifierService)

    return c.json(task, HttpStatusCodes.CREATED)
  } catch (error: any) {
    console.error('Error creating task:', error)
    
    if (error.message.includes('already exists')) {
      return c.json({
        success: false,
        error: error.message,
      }, HttpStatusCodes.CONFLICT)
    }

    return c.json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
  }
}

export const getAllTasksController = async (c: Context): Promise<Response> => {
  try {
    const tasks = await getAllTasks()
    
    return c.json(tasks, HttpStatusCodes.OK)
  } catch (error: any) {
    console.error('Error getting tasks:', error)
    
    return c.json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
  }
}

export const getTaskByTransactionIdController = async (c: Context): Promise<Response> => {
  try {
    const { transactionId } = c.req.param()
    
    if (!transactionId) {
      return c.json({
        success: false,
        error: 'Transaction ID is required',
      }, HttpStatusCodes.BAD_REQUEST)
    }

    const task = await getTaskByTransactionId(transactionId)
    
    if (!task) {
      return c.json({
        success: false,
        error: 'Task not found',
      }, HttpStatusCodes.NOT_FOUND)
    }

    return c.json(task, HttpStatusCodes.OK)
  } catch (error: any) {
    console.error('Error getting task:', error)
    
    return c.json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
  }
}
