import { Context } from "hono";
import {
  getTasks,
  getTaskByTransactionId,
  createTask,
  executeTask,
  batchExecuteTasks,
  getPublicTasks,
  batchCreateTasks,
} from "./tasks.service";
import {
  CreateTaskSchema,
  GetTasksQuerySchema,
  GetPublicTasksQuerySchema,
  ExecuteTaskSchema,
  BatchExecuteTasksSchema,
  BatchCreateTasksSchema,
} from "./tasks.schema";
import { uploadFileToS3, generatePresignedUploadUrl, isS3Configured } from "@/services/s3-service";
import { z } from "zod";

export const getTasksController = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }
    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 10;
    const taskType = c.req.query("taskType") as z.infer<typeof GetTasksQuerySchema>["taskType"];
    const search = c.req.query("search") as z.infer<typeof GetTasksQuerySchema>["search"];
    const dateFrom = c.req.query("dateFrom") as z.infer<typeof GetTasksQuerySchema>["dateFrom"];
    const dateTo = c.req.query("dateTo") as z.infer<typeof GetTasksQuerySchema>["dateTo"];
    const status = c.req.query("status") as z.infer<typeof GetTasksQuerySchema>["status"];
    const state = c.req.query("state") as z.infer<typeof GetTasksQuerySchema>["state"];
    const query = { page, limit, taskType, search, dateFrom, dateTo, status, state } as z.infer<
      typeof GetTasksQuerySchema
    >;
    const result = await getTasks(query);

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getTaskByTransactionIdController = async (c: Context) => {
  try {
    const { transactionId } = c.req.param();
    const task = await getTaskByTransactionId(transactionId);

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json(task);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const createTaskController = async (c: Context) => {
  try {
    const taskData = (await c.req.json()) as z.infer<typeof CreateTaskSchema>;
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const task = await createTask(taskData, user);

    return c.json(task, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const batchCreateTasksController = async (c: Context) => {
  try {
    const tasksData = (await c.req.json()) as z.infer<typeof BatchCreateTasksSchema>;
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    // Validar que sea un array
    if (!Array.isArray(tasksData.tasks)) {
      return c.json({ error: "Request body must contain an array of tasks" }, 400);
    }

    const result = await batchCreateTasks(tasksData.tasks, user);

    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const executeTaskController = async (c: Context) => {
  try {
    const taskData = (await c.req.json()) as z.infer<typeof ExecuteTaskSchema>;
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const result = await executeTask(taskData, user);

    return c.json(result, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const batchExecuteTasksController = async (c: Context) => {
  try {
    const batchData = (await c.req.json()) as z.infer<typeof BatchExecuteTasksSchema>;
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const result = await batchExecuteTasks(batchData, user);

    return c.json(result, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const uploadProofImageController = async (c: Context) => {
  try {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    if (!isS3Configured()) {
      return c.json({ error: "S3 is not configured" }, 500);
    }

    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const taskId = formData.get("taskId") as string;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    if (!taskId) {
      return c.json({ error: "Task ID is required" }, 400);
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: "Invalid file type. Only images are allowed." }, 400);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return c.json({ error: "File too large. Maximum size is 10MB." }, 400);
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const result = await uploadFileToS3(buffer, file.name, file.type, `proofs/${taskId}`);

    return c.json(
      {
        success: true,
        proofValue: result.url,
        fileName: result.fileName,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
      },
      200
    );
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const generateImageUploadUrlController = async (c: Context) => {
  try {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    if (!isS3Configured()) {
      return c.json({ error: "S3 is not configured" }, 500);
    }

    const { fileName, mimeType, taskId } = await c.req.json();

    if (!fileName || !mimeType || !taskId) {
      return c.json({ error: "fileName, mimeType and taskId are required" }, 400);
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(mimeType)) {
      return c.json({ error: "Invalid file type. Only images are allowed." }, 400);
    }

    const result = await generatePresignedUploadUrl(fileName, mimeType, `proofs/${taskId}`);

    return c.json(
      {
        uploadUrl: result.uploadUrl,
        proofValue: result.publicUrl,
        key: result.key,
      },
      200
    );
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getPublicTasksController = async (c: Context) => {
  try {
    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 10;
    const taskType = c.req.query("taskType") as z.infer<
      typeof GetPublicTasksQuerySchema
    >["taskType"];
    const search = c.req.query("search") as z.infer<typeof GetPublicTasksQuerySchema>["search"];
    const dateFrom = c.req.query("dateFrom") as z.infer<typeof GetPublicTasksQuerySchema>["dateFrom"];
    const dateTo = c.req.query("dateTo") as z.infer<typeof GetPublicTasksQuerySchema>["dateTo"];

    const query = { page, limit, taskType, search, dateFrom, dateTo } as z.infer<typeof GetPublicTasksQuerySchema>;
    const result = await getPublicTasks(query);

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
