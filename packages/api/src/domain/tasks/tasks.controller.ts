import { Context } from 'hono'
import { getTasks, getTaskByTransactionId, createTask, executeTask, batchExecuteTasks, getTasksReadyForExecution } from './tasks.service'
import { CreateTaskSchema, GetTasksQuerySchema, ExecuteTaskSchema, BatchExecuteTasksSchema } from './tasks.schema'
import { VerifierService } from '@/services/verifier-service'
import { z } from 'zod'

export const getTasksController = async (c: Context) => {
  try {
    const user = c.get("user");
    console.log("getTasksController user", user);
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }
    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 10;
    const taskType = c.req.query("taskType") as z.infer<typeof GetTasksQuerySchema>["taskType"]
    const search = c.req.query("search") as z.infer<typeof GetTasksQuerySchema>["search"]
    const dateFrom = c.req.query("dateFrom") as z.infer<typeof GetTasksQuerySchema>["dateFrom"]
    const dateTo = c.req.query("dateTo") as z.infer<typeof GetTasksQuerySchema>["dateTo"]
    const status = c.req.query("status") as z.infer<typeof GetTasksQuerySchema>["status"]
    const state = c.req.query("state") as z.infer<typeof GetTasksQuerySchema>["state"]
    const query = { page, limit, taskType, search, dateFrom, dateTo, status, state } as z.infer<typeof GetTasksQuerySchema>
    const result = await getTasks(query)
    
    return c.json(result)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
}

export const getTaskByTransactionIdController = async (c: Context) => {
  try {
    const { transactionId } = c.req.param()
    const task = await getTaskByTransactionId(transactionId)
    
    if (!task) {
      return c.json({ error: 'Task not found' }, 404)
    }
    
    return c.json(task)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
}

export const createTaskController = async (c: Context) => {
  try {
    const taskData = await c.req.json() as z.infer<typeof CreateTaskSchema>
    const user = c.get("user");
    console.log("getUserProfileController user", user);
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

  
    const task = await createTask(taskData, user)
    
    return c.json(task, 201)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
}

export const executeTaskController = async (c: Context) => {
  try {
    const taskData = await c.req.json() as z.infer<typeof ExecuteTaskSchema>
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const result = await executeTask(taskData, user)
    
    return c.json(result, 200)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
}

export const batchExecuteTasksController = async (c: Context) => {
  try {
    const batchData = await c.req.json() as z.infer<typeof BatchExecuteTasksSchema>
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const result = await batchExecuteTasks(batchData, user)
    
    return c.json(result, 200)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
}

export const getTasksReadyForExecutionController = async (c: Context) => {
  try {
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const tasks = await getTasksReadyForExecution()
    
    return c.json({ tasks }, 200)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
}
