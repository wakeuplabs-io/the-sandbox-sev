import { useState } from 'react'
import { FaImage, FaTrash, FaCheck, FaFile, FaSpinner } from 'react-icons/fa'
import { clsx } from 'clsx'
import { useTaskExecution } from '../hooks/use-task-execution'

interface ProofData {
  proofType: 'TEXT' | 'IMAGE'
  proofValue: string
  fileName?: string
  fileSize?: number
  mimeType?: string
}

interface ProofUploadAreaProps {
  taskId: string
  onProofChange: (hasProof: boolean) => void
  onProofsChange: (proofs: ProofData[]) => void
}

export function ProofUploadArea({ taskId, onProofChange, onProofsChange }: ProofUploadAreaProps) {
  const [proofs, setProofs] = useState<ProofData[]>([])
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image')
  const [textDescription, setTextDescription] = useState('')
  
  const { uploadProofImage, isUploading, uploadError } = useTaskExecution()

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const result = await uploadProofImage(file, taskId)
      if (result) {
        const newProof: ProofData = {
          proofType: 'IMAGE',
          proofValue: result.proofValue,
          fileName: result.fileName,
          fileSize: result.fileSize,
          mimeType: result.mimeType
        }
        
        const updatedProofs = [...proofs, newProof]
        setProofs(updatedProofs)
        onProofChange(true)
        onProofsChange(updatedProofs)
      }
    }
  }

  const handleTextSubmit = () => {
    if (textDescription.trim()) {
      const newProof: ProofData = {
        proofType: 'TEXT',
        proofValue: textDescription.trim()
      }
      
      const updatedProofs = [...proofs, newProof]
      setProofs(updatedProofs)
      setTextDescription('')
      onProofChange(true)
      onProofsChange(updatedProofs)
    }
  }

  const handleRemoveProof = (index: number) => {
    setProofs(prev => {
      const newProofs = prev.filter((_, i) => i !== index)
      onProofChange(newProofs.length > 0)
      onProofsChange(newProofs)
      return newProofs
    })
  }

  const renderProofPreview = (proof: ProofData, index: number) => {
    switch (proof.proofType) {
      case 'IMAGE':
        return (
          <div key={index} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <img 
              src={proof.proofValue} 
              alt="Proof" 
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{proof.fileName}</p>
              <p className="text-xs text-base-content/60">Image proof</p>
            </div>
            <button
              onClick={() => handleRemoveProof(index)}
              className="btn btn-ghost btn-sm text-error"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        )
      
      case 'TEXT':
        return (
          <div key={index} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <FaFile className="h-6 w-6 text-info" />
            <div className="flex-1">
              <p className="text-sm line-clamp-2">{proof.proofValue}</p>
              <p className="text-xs text-base-content/60">Text description</p>
            </div>
            <button
              onClick={() => handleRemoveProof(index)}
              className="btn btn-ghost btn-sm text-error"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-base-content">Upload Execution Proof</h4>
      
      {/* Proof Tabs */}
      <div className="tabs tabs-boxed">
        <button
          className={clsx("tab", { "tab-active": activeTab === 'image' })}
          onClick={() => setActiveTab('image')}
        >
          <FaImage className="h-4 w-4 mr-2" />
          Image
        </button>
        <button
          className={clsx("tab", { "tab-active": activeTab === 'text' })}
          onClick={() => setActiveTab('text')}
        >
          <FaFile className="h-4 w-4 mr-2" />
          Text
        </button>
      </div>

      {/* Upload Forms */}
      <div className="space-y-4">
        {activeTab === 'image' && (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <FaSpinner className="h-8 w-8 mx-auto text-primary mb-2 animate-spin" />
                  <p className="text-sm text-base-content/60">Uploading image...</p>
                </div>
              ) : (
                <>
                  <FaImage className="h-8 w-8 mx-auto text-base-content/40 mb-2" />
                  <p className="text-sm text-base-content/60 mb-3">
                    Drag & drop an image or click to upload
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                  />
                </>
              )}
            </div>
            {uploadError && (
              <div className="alert alert-error">
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Describe the execution proof..."
                rows={3}
                value={textDescription}
                onChange={(e) => setTextDescription(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleTextSubmit}
                  disabled={!textDescription.trim()}
                  className="btn btn-primary btn-sm"
                >
                  <FaCheck className="h-4 w-4 mr-2" />
                  Add Description
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Proofs Preview */}
      {proofs.length > 0 && (
        <div className="space-y-2">
          <h5 className="font-medium text-sm text-base-content/70">
            Uploaded Proofs ({proofs.length})
          </h5>
          <div className="space-y-2">
            {proofs.map((proof, index) => renderProofPreview(proof, index))}
          </div>
        </div>
      )}
    </div>
  )
}
