import { TaskTypeButtons } from "./components/task-type-buttons";
import { ExcelInput } from "./components/excel-input";
import { TaskTypeInfo } from "./components/task-type-info";
import { InstructionsAlert } from "./components/instructions-alert";
import { RowCountDisplay } from "./components/row-count-display";
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
            <div className="card-body space-y-4">
              <TaskTypeInfo taskType={selectedTaskType} />
              <InstructionsAlert maxBatchSize={maxBatchSize} />
              <ExcelInput
                value={rawExcelData}
                onChange={handleExcelDataChange}
                validationStatus={validationStatus}
              />
              <RowCountDisplay rowCount={parsedData.length} />
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
