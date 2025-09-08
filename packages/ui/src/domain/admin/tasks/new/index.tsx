import { useState } from "react";
import { TaskTypeButtons } from "./components/task-type-buttons";
import { TaskType } from '@the-sandbox-sev/api'
import { ParsedRow, ValidationError } from "./types/tasks-new.types";
import { parseExcelData } from "./utils/excel-parser";
import { useLayout } from "@/context/layout-context";
import { validateTaskData } from "./utils/task-validators";
import { ExcelInput } from "./components/excel-input";
import { DataPreviewTable } from "./components/data-preview-table";
import { SubmitActions } from "./components/submit-actions";
import { useTasks } from "@/hooks/use-tasks";
import { toast } from "react-toastify";
import { useRouter } from "@tanstack/react-router";

const MAX_BATCH_SIZE = 20;

export function TasksNewPage() {
  const { setIsLoading } = useLayout();
  const { createTask, createTasksBatch } = useTasks();
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(null);
  const [rawExcelData, setRawExcelData] = useState("");
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [validationStatus, setValidationStatus] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const router = useRouter();
  // Handle task type selection
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
      toast.error(`Cannot create more than ${MAX_BATCH_SIZE} tasks at once. Please reduce the number of valid tasks.`);
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
            failed: 0
          }
        };
      } else {
        // Múltiples tasks: usar endpoint batch (más eficiente)
        result = await createTasksBatch.mutateAsync(tasksData);
      }
      
      // Mostrar resultados
      const method = validTasks.length === 1 ? 'individual' : 'batch';
      toast.success(`Successfully created ${result.summary.successful} tasks using ${method} method!`);
      
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

  const hasErrors = validationStatus === "invalid" || errors.length > 0;
  const validTasks = parsedData.filter(row => row.isValid);
  const exceedsBatchLimit = validTasks.length > MAX_BATCH_SIZE;
  const canSubmit = validationStatus === "valid" && validTasks.length > 0 && !exceedsBatchLimit;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Tasks</h1>
      </div>

      <div className="space-y-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Select Task Type</h2>
            <TaskTypeButtons selectedType={selectedTaskType} onTypeChange={handleTaskTypeChange} />
          </div>
        </div>

        {selectedTaskType && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Paste Excel Data</h2>
              <ExcelInput
                value={rawExcelData}
                onChange={handleExcelDataChange}
                taskType={selectedTaskType}
                validationStatus={validationStatus}
                parsedRowCount={parsedData.length}
              />
            </div>
          </div>
        )}

        {parsedData.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Data Preview</h2>
              <DataPreviewTable data={parsedData} errors={errors} taskType={selectedTaskType!} />
            </div>
          </div>
        )}

        {parsedData.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <SubmitActions
                hasErrors={hasErrors}
                validTasksCount={validTasks.length}
                totalTasksCount={parsedData.length}
                onSubmit={handleSubmit}
                isLoading={createTask.isPending || createTasksBatch.isPending}
                canSubmit={canSubmit}
                exceedsBatchLimit={exceedsBatchLimit}
                maxBatchSize={MAX_BATCH_SIZE}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
