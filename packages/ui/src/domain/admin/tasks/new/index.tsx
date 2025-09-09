import { TaskTypeButtons } from "./components/task-type-buttons";
import { ExcelInput } from "./components/excel-input";
import { DataPreviewTable } from "./components/data-preview-table";
import { SubmitActions } from "./components/submit-actions";
import { useNewTask } from "./hooks/use-new-task";

export function TasksNewPage() {
  const {
    selectedTaskType,
    rawExcelData,
    parsedData,
    validationStatus,
    errors,
    validTasks,
    exceedsBatchLimit,
    canSubmit,
    handleTaskTypeChange,
    handleExcelDataChange,
    handleSubmit,
    maxBatchSize,
    isCreating,
  } = useNewTask();

  return (
    <section className="section">
      <h1 className="heading-1">Create New Tasks</h1>
      <div className="space-y-6">
        <div className="">
          <div className="card-body">
            <h2 className="card-title">Select Task Type</h2>
            <TaskTypeButtons selectedType={selectedTaskType} onTypeChange={handleTaskTypeChange} />
          </div>
        </div>

        {selectedTaskType && (
          <div className="">
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
          <div className="">
            <div className="card-body">
              <h2 className="card-title">Data Preview</h2>
              <DataPreviewTable data={parsedData} errors={errors} taskType={selectedTaskType!} />
            </div>
          </div>
        )}

        {parsedData.length > 0 && (
          <div className="">
            <div className="card-body">
              <SubmitActions
                validTasksCount={validTasks.length}
                totalTasksCount={parsedData.length}
                onSubmit={handleSubmit}
                isLoading={isCreating}
                canSubmit={canSubmit}
                exceedsBatchLimit={exceedsBatchLimit}
                maxBatchSize={maxBatchSize}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
