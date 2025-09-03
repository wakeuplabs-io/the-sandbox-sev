import { useState } from 'react'
import { useApiClient } from '@/hooks/use-api-client'
import { useWeb3Auth } from '@/context/web3auth'
import envParsed from '@/env-parsed'
import { toast } from 'react-toastify'

interface ProofData {
  proofType: 'TEXT' | 'IMAGE'
  proofValue: string
  fileName?: string
  fileSize?: number
  mimeType?: string
}

interface ExecuteTaskData {
  taskId: string
  proofs: ProofData[]
}

interface TaskExecutionState {
  isUploading: boolean
  uploadError: string | null
  isExecuting: boolean
  executionError: string | null
  isLoading: boolean
  error: string | null
}

interface UploadProofImageResponse {
  success: boolean
  proofValue: string
  fileName: string
  fileSize: number
  mimeType: string
}

interface ExecuteTaskResponse {
  task: any
  proofs: any[]
}

interface BatchExecuteResponse {
  successful: ExecuteTaskResponse[]
  failed: Array<{
    taskId: string
    error: string
  }>
  summary: {
    total: number
    successful: number
    failed: number
  }
}

export function useTaskExecution() {
  const [state, setState] = useState<TaskExecutionState>({
    isUploading: false,
    uploadError: null,
    isExecuting: false,
    executionError: null,
    isLoading: false,
    error: null,
  })

  const client = useApiClient()
  const { idToken } = useWeb3Auth()



  const setUploading = (isUploading: boolean, error: string | null = null) => {
    setState(prev => ({ 
      ...prev, 
      isUploading, 
      uploadError: error,
      isLoading: isUploading || prev.isExecuting
    }))
  }

  const setExecuting = (isExecuting: boolean, error: string | null = null) => {
    setState(prev => ({ 
      ...prev, 
      isExecuting, 
      executionError: error,
      isLoading: prev.isUploading || isExecuting
    }))
  }

  const uploadProofImage = async (file: File, taskId: string): Promise<UploadProofImageResponse | null> => {
    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('taskId', taskId)

      // Use direct fetch for FormData uploads (more reliable than Hono client)
      const response = await fetch(`${envParsed.API_URL}/api/tasks/upload-proof-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Bypass-Tunnel-Reminder': 'true',
          'ngrok-skip-browser-warning': 'true',
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const result = await response.json() as UploadProofImageResponse
      
      toast.success('Image uploaded successfully!')
      setUploading(false)
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image'
      setUploading(false, errorMessage)
      toast.error(`Upload failed: ${errorMessage}`)
      return null
    }
  }

  const executeTask = async (taskId: string, proofs: ProofData[]): Promise<ExecuteTaskResponse | null> => {
    try {
      setExecuting(true)

      const response = await client.api.tasks.execute.$post({
        json: {
          taskId,
          proofs
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to execute task')
      }

      const result = await response.json() as ExecuteTaskResponse
      
      toast.success('Task executed successfully!')
      setExecuting(false)
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute task'
      setExecuting(false, errorMessage)
      toast.error(`Execution failed: ${errorMessage}`)
      return null
    }
  }

  const batchExecuteTasks = async (tasks: ExecuteTaskData[]): Promise<BatchExecuteResponse | null> => {
    try {
      setExecuting(true)

      const response = await client.api.tasks['batch-execute'].$post({
        json: {
          tasks
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to execute tasks')
      }

      const result = await response.json() as BatchExecuteResponse
      
      const { summary } = result
      if (summary.failed > 0) {
        toast.warning(`${summary.successful} tasks executed successfully, ${summary.failed} failed`)
      } else {
        toast.success(`All ${summary.successful} tasks executed successfully!`)
      }
      
      setExecuting(false)
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute tasks'
      setExecuting(false, errorMessage)
      toast.error(`Batch execution failed: ${errorMessage}`)
      return null
    }
  }

  return {
    // Estados
    ...state,
    
    // Funciones
    uploadProofImage,
    executeTask,
    batchExecuteTasks,
  }
}
