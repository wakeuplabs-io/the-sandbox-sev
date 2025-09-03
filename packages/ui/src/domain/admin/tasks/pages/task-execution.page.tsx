import { useState } from 'react'
import { FaPlay, FaTrash, FaFilter } from 'react-icons/fa'
import { useTasksList } from '../hooks/use-tasks-list'
import { useTaskExecution } from '@/hooks/use-task-execution'
import { TaskExecutionCard } from '../components/execute/task-execution-card'
import { TasksFilters } from '../components/list/tasks-filters'
import { TaskStateEnum } from '@/shared/constants'

export function TaskExecutionPage() {
  const { tasks, isLoading, filters, updateFilters } = useTasksList()
  const { batchExecuteTasks, isExecuting } = useTaskExecution()
  
  // Filter to show only STORED tasks
  const storedTasks = tasks.filter(task => task.state === TaskStateEnum.STORED)
  
  // Track tasks with proofs ready for execution
  const [tasksWithProofs, setTasksWithProofs] = useState<Set<string>>(new Set())
  // Track proofs for each task
  const [taskProofs, setTaskProofs] = useState<Record<string, any[]>>({})
  
  const handleTaskProofReady = (taskId: string, hasProof: boolean) => {
    setTasksWithProofs(prev => {
      const newSet = new Set(prev)
      if (hasProof) {
        newSet.add(taskId)
      } else {
        newSet.delete(taskId)
      }
      return newSet
    })
  }

  const handleTaskProofsChange = (taskId: string, proofs: any[]) => {
    setTaskProofs(prev => ({
      ...prev,
      [taskId]: proofs
    }))
  }
  
  const handleExecuteAll = async () => {
    const readyTasks = storedTasks.filter(task => tasksWithProofs.has(task.id))
    
    if (readyTasks.length === 0) {
      return
    }

    // Prepare batch execution data
    const batchData = readyTasks.map(task => ({
      taskId: task.id,
      proofs: taskProofs[task.id] || []
    }))

    // Execute batch
    const result = await batchExecuteTasks(batchData)
    
    if (result) {
      // Clear executed tasks from state
      setTasksWithProofs(prev => {
        const newSet = new Set(prev)
        readyTasks.forEach(task => newSet.delete(task.id))
        return newSet
      })
      
      // Clear proofs for executed tasks
      setTaskProofs(prev => {
        const newProofs = { ...prev }
        readyTasks.forEach(task => delete newProofs[task.id])
        return newProofs
      })
    }
  }
  
  const handleClearAllProofs = () => {
    setTasksWithProofs(new Set())
    setTaskProofs({})
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content mb-2">
          <FaPlay className="inline-block mr-3" />
          Execute Tasks
        </h1>
        <p className="text-base-content/70">
          Upload execution proofs for stored tasks and execute them in batch
        </p>
      </div>

      {/* Filters */}
      <TasksFilters 
        filters={filters} 
        onFiltersChange={updateFilters}
      />

      {/* Batch Actions - Always visible when there are tasks with proofs */}
      {tasksWithProofs.size > 0 && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FaFilter className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">
                  {tasksWithProofs.size} task{tasksWithProofs.size !== 1 ? 's' : ''} ready for execution
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearAllProofs}
                  className="btn btn-outline btn-sm"
                  disabled={isExecuting}
                >
                  <FaTrash className="h-4 w-4 mr-2" />
                  Clear All Proofs
                </button>
                <button
                  onClick={handleExecuteAll}
                  className="btn btn-primary btn-sm"
                  disabled={isExecuting}
                >
                  <FaPlay className="h-4 w-4 mr-2" />
                  {isExecuting ? 'Executing...' : 'Execute All Ready Tasks'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="h-4 bg-base-300 rounded w-1/4"></div>
                    <div className="h-4 bg-base-300 rounded w-1/6"></div>
                    <div className="h-4 bg-base-300 rounded w-1/6"></div>
                    <div className="h-4 bg-base-300 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : storedTasks.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h3 className="text-lg font-semibold text-base-content/70">
                No stored tasks found
              </h3>
              <p className="text-base-content/50">
                All tasks have been executed or there are no tasks matching your filters.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Task Cards */}
            <div className="space-y-4">
              {storedTasks.map(task => (
                <TaskExecutionCard
                  key={task.id}
                  task={task}
                  onProofReady={(hasProof) => handleTaskProofReady(task.id, hasProof)}
                  onProofsChange={(proofs) => handleTaskProofsChange(task.id, proofs)}
                />
              ))}
            </div>


          </>
        )}
      </div>
    </div>
  )
}
