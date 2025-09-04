import { handle } from "hono/aws-lambda";
import { serve } from "@hono/node-server";
import env from "./env";
import app from "./app";

export { default } from "./app";
export type { AppType } from "./app";

// Re-export types that might be useful for the UI
export type { User } from "./domain/users/users.schema";

// Re-export Prisma types
export type { Task, TaskExecutionProof, TaskType, TaskState, ProofType, ProofStatus } from "./generated/prisma";

// Re-export task-related types
export type { 
  CreateTaskInput, 
  LiquidationTaskInput, 
  AcquisitionTaskInput, 
  AuthorizationTaskInput, 
  ArbitrageTaskInput,
  ProofData,
  ExecuteTaskInput,
  BatchExecuteTasksInput,
  GetPublicTasksQuery
} from "./domain/tasks/tasks.schema";

const port = env.PORT;

// For AWS Lambda
export const handler = handle(app);

// For local development
if (process.env.NODE_ENV !== "production") {
  serve({
    fetch: app.fetch,
    port,
  });

  console.log(`
  🚀 Server running!
  🔥 REST API: http://localhost:${port}/api
    `);
}
