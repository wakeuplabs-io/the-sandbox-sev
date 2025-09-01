import { authMiddleware } from "@/middlewares/auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateTaskSchema } from "./tasks.schema";
import {
  createTaskController,
  getAllTasksController,
  getTaskByTransactionIdController,
} from "./tasks.controller";
import { requireRole } from "@/middlewares/require-role";
import { Role } from "@/generated/prisma";

const tasks = new Hono()
  .use("/*", authMiddleware)
  .get("/", getAllTasksController)
  .post("/", requireRole([Role.ADMIN, Role.CONSULTANT]), zValidator("json", CreateTaskSchema), createTaskController)
  .get("/:transactionId", getTaskByTransactionIdController)

export default tasks;
