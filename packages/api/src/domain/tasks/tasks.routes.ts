import { authMiddleware } from "@/middlewares/auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  getTasksController,
  getTaskByTransactionIdController,
  createTaskController,
} from "./tasks.controller";
import { CreateTaskSchema, GetTasksQuerySchema } from "./tasks.schema";
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
  );

export default tasks;
