import { useState } from 'react'
import { TaskTypeButtons } from './components/task-type-buttons'
import { TaskType } from './types/tasks-new.types'
import { ParsedRow, ValidationError } from './types/tasks-new.types'
import { parseExcelData } from './utils/excel-parser'
import { useLayout } from '@/context/layout-context'
import { validateTaskData } from './utils/task-validators'
import { ExcelInput } from './components/excel-input'
import { DataPreviewTable } from './components/data-preview-table'
import { SubmitActions } from './components/submit-actions'
import { useTasks } from '@/hooks/use-tasks'
import { toast } from 'react-toastify'

export function TasksNewPage() {
  const { setIsLoading } = useLayout()
  const { createTask } = useTasks()
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(null)
  const [rawExcelData, setRawExcelData] = useState('')
  const [parsedData, setParsedData] = useState<ParsedRow[]>([])
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle')
  const [errors, setErrors] = useState<ValidationError[]>([])

  // Handle task type selection
  const handleTaskTypeChange = (taskType: TaskType) => {
    setSelectedTaskType(taskType)
    setRawExcelData('')
    setParsedData([])
    setValidationStatus('idle')
    setErrors([])
  }

  // Handle Excel data input
  const handleExcelDataChange = (data: string) => {
    setRawExcelData(data)
    
    if (!data.trim() || !selectedTaskType) {
      setParsedData([])
      setValidationStatus('idle')
      setErrors([])
      return
    }

    console.log('Parsing Excel data for task type:', selectedTaskType, 'typeof:', typeof selectedTaskType)
    
    setValidationStatus('validating')
    
    try {
      // Parse the Excel data
      const parsed = parseExcelData(data, selectedTaskType)
      setParsedData(parsed)
      
      // Validate the parsed data
      const validationErrors: ValidationError[] = []
      parsed.forEach((row, index) => {
        console.log(`Validating row ${index} with task type: ${selectedTaskType}`)
        const rowErrors = validateTaskData(row.data, index, selectedTaskType)
        validationErrors.push(...rowErrors)
      })
      
      setErrors(validationErrors)
      setValidationStatus(validationErrors.length > 0 ? 'invalid' : 'valid')
    } catch (error) {
      console.error('Error parsing Excel data:', error)
      setValidationStatus('invalid')
      setErrors([{
        rowIndex: 0,
        columnName: 'general',
        message: 'Error parsing Excel data. Please check the format.',
        type: 'error'
      }])
    }
  }

  // Handle submit
  const handleSubmit = async () => {
    if (validationStatus !== 'valid' || parsedData.length === 0) {
      return
    }

    setIsLoading(true)
    try {
      // Create all valid tasks
      const validTasks = parsedData.filter(row => row.isValid)
      console.log('Creating tasks:', validTasks)
      
      // Create tasks one by one
      const createdTasks = []
      for (const row of validTasks) {
        const taskData = {
          taskType: selectedTaskType,
          ...row.data
        }
        
        const createdTask = await createTask.mutateAsync(taskData)
        createdTasks.push(createdTask)
      }
      
      // Show success toast
      toast.success(`Successfully created ${createdTasks.length} tasks!`)
      
      // Reset form
      setRawExcelData('')
      setParsedData([])
      setValidationStatus('idle')
      setErrors([])
    } catch (error) {
      console.error('Error creating tasks:', error)
      toast.error('Error creating tasks. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const hasErrors = validationStatus === 'invalid' || errors.length > 0
  const validTasks = parsedData.filter(row => row.isValid)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Tasks</h1>
      </div>

      <div className="space-y-6">
        {/* Task Type Selection */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Select Task Type</h2>
            <TaskTypeButtons 
              selectedType={selectedTaskType}
              onTypeChange={handleTaskTypeChange}
            />
          </div>
        </div>

        {/* Excel Input */}
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

        {/* Data Preview Table */}
        {parsedData.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Data Preview</h2>
              <DataPreviewTable 
                data={parsedData}
                errors={errors}
                taskType={selectedTaskType!}
              />
            </div>
          </div>
        )}

        {/* Submit Actions */}
        {parsedData.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <SubmitActions 
                hasErrors={hasErrors}
                validTasksCount={validTasks.length}
                totalTasksCount={parsedData.length}
                onSubmit={handleSubmit}
                isLoading={createTask.isPending}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
