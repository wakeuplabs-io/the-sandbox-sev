import { useState } from "react";
import { TaskType } from "@the-sandbox-sev/api";
import { ParsedRow, ValidationError } from "../types/tasks-new.types";
import { parseExcelData } from "../utils/excel-parser";
import { useLayout } from "@/context/layout-context";
import { validateTaskData } from "../utils/task-validators";
import { useTasks } from "@/hooks/use-tasks";
import { toast } from "react-toastify";
import { useRouter } from "@tanstack/react-router";

const MAX_BATCH_SIZE = 20;

export function useNewTask() {
  const { setIsLoading } = useLayout();
  const { createTask, createTasksBatch } = useTasks();
  const router = useRouter();

  // State
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(null);
  const [rawExcelData, setRawExcelData] = useState("");
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [validationStatus, setValidationStatus] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Computed values
  const hasErrors = validationStatus === "invalid" || errors.length > 0;
  const validTasks = parsedData.filter(row => row.isValid);
  const exceedsBatchLimit = validTasks.length > MAX_BATCH_SIZE;
  const canSubmit = validationStatus === "valid" && validTasks.length > 0 && !exceedsBatchLimit;

  // Handlers
  const handleTaskTypeChange = (taskType: TaskType) => {
    setSelectedTaskType(taskType);
    setRawExcelData("");
    setParsedData([]);
    setValidationStatus("idle");
    setErrors([]);
  };

  const handleExcelDataChange = (data: string) => {
    setRawExcelData(data);

    if (!data.trim() || !selectedTaskType) {
      setParsedData([]);
      setValidationStatus("idle");
      setErrors([]);
      return;
    }
    setValidationStatus("validating");

    try {
      const parsed = parseExcelData(data, selectedTaskType);
      setParsedData(parsed);

      const validationErrors: ValidationError[] = [];
      parsed.forEach((row, index) => {
        const rowErrors = validateTaskData(row.data, index, selectedTaskType);
        validationErrors.push(...rowErrors);
      });

      setErrors(validationErrors);
      setValidationStatus(validationErrors.length > 0 ? "invalid" : "valid");
    } catch (error) {
      console.error("Error parsing Excel data:", error);
      setValidationStatus("invalid");
      setErrors([
        {
          rowIndex: 0,
          columnName: "general",
          message: "Error parsing Excel data. Please check the format.",
          type: "error",
        },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (validationStatus !== "valid" || parsedData.length === 0) {
      return;
    }

    const validTasks = parsedData.filter(row => row.isValid);

    // Validar límite de batch
    if (validTasks.length > MAX_BATCH_SIZE) {
      toast.error(
        `Cannot create more than ${MAX_BATCH_SIZE} tasks at once. Please reduce the number of valid tasks.`
      );
      return;
    }

    setIsLoading(true);
    try {
      // Preparar datos
      const tasksData = validTasks.map(row => ({
        taskType: selectedTaskType,
        ...row.data,
      }));

      let result;

      if (validTasks.length === 1) {
        // Una sola task: usar endpoint individual (más simple)
        const createdTask = await createTask.mutateAsync(tasksData[0]);
        result = {
          successful: [createdTask],
          failed: [],
          summary: {
            total: 1,
            successful: 1,
            failed: 0,
          },
        };
      } else {
        // Múltiples tasks: usar endpoint batch (más eficiente)
        result = await createTasksBatch.mutateAsync(tasksData);
      }

      // Mostrar resultados
      const method = validTasks.length === 1 ? "individual" : "batch";
      toast.success(
        `Successfully created ${result.summary.successful} tasks using ${method} method!`
      );

      if (result.summary.failed > 0) {
        toast.warning(`${result.summary.failed} tasks failed to create`);
      }

      // Reset form
      setRawExcelData("");
      setParsedData([]);
      setValidationStatus("idle");
      setErrors([]);
      router.navigate({ to: "/admin/tasks" });
    } catch (error) {
      console.error("Error creating tasks:", error);
      toast.error("Error creating tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    selectedTaskType,
    rawExcelData,
    parsedData,
    validationStatus,
    errors,
    
    // Computed values
    hasErrors,
    validTasks,
    exceedsBatchLimit,
    canSubmit,
    
    // Handlers
    handleTaskTypeChange,
    handleExcelDataChange,
    handleSubmit,
    
    // Constants
    maxBatchSize: MAX_BATCH_SIZE,
    
    // Loading states
    isCreating: createTask.isPending || createTasksBatch.isPending,
  };
}
