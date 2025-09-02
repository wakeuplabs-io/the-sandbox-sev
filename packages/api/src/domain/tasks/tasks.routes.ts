import { authMiddleware } from "@/middlewares/auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  getTasksController,
  getTaskByTransactionIdController,
  createTaskController,
  executeTaskController,
  batchExecuteTasksController,
  uploadProofImageController,
  generateImageUploadUrlController,
} from "./tasks.controller";
import { CreateTaskSchema, GetTasksQuerySchema, ExecuteTaskSchema, BatchExecuteTasksSchema } from "./tasks.schema";
import { requireRole } from "@/middlewares/require-role";
import { Role } from "@/generated/prisma";

const tasks = new Hono()
  .use("/*", authMiddleware)
  .get("/", zValidator("query", GetTasksQuerySchema), getTasksController)
  .get(
    "/:transactionId",
    zValidator(
      "param",
      z.object({
        transactionId: z.string(),
      })
    ),
    getTaskByTransactionIdController
  )
  .post(
    "/",
    requireRole([Role.ADMIN, Role.CONSULTANT]),
    zValidator("json", CreateTaskSchema),
    createTaskController
  )
  .post(
    "/execute",
    requireRole([Role.ADMIN, Role.CONSULTANT]),
    zValidator("json", ExecuteTaskSchema),
    executeTaskController
  )
  .post(
    "/batch-execute",
    requireRole([Role.ADMIN, Role.CONSULTANT]),
    zValidator("json", BatchExecuteTasksSchema),
    batchExecuteTasksController
  )

  .post(
    "/upload-proof-image",
    requireRole([Role.ADMIN, Role.CONSULTANT]),
    uploadProofImageController
  )
  .post(
    "/generate-upload-url",
    requireRole([Role.ADMIN, Role.CONSULTANT]),
    zValidator("json", z.object({
      fileName: z.string(),
      mimeType: z.string(),
      taskId: z.string(),
    })),
    generateImageUploadUrlController
  );

export default tasks;
