import { authMiddleware } from '@/middlewares/auth'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import {
  getTasksController,
  getTaskByTransactionIdController,
  createTaskController,
} from './tasks.controller'
import { CreateTaskSchema, GetTasksQuerySchema } from './tasks.schema'

const tasks = new Hono()
  .use('/*', authMiddleware)
  .get('/', zValidator('query', GetTasksQuerySchema), getTasksController)
  .get(
    '/:transactionId',
    zValidator(
      'param',
      z.object({
        transactionId: z.string(),
      })
    ),
    getTaskByTransactionIdController
  )
  .post('/', zValidator('json', CreateTaskSchema), createTaskController)

export default tasks
