import { useState } from 'react'
import { FaImage, FaLink, FaTrash, FaCheck, FaFile } from 'react-icons/fa'
import { clsx } from 'clsx'

interface ProofData {
  type: 'image' | 'transaction' | 'text'
  data: string
  fileName?: string
}

interface ProofUploadAreaProps {
  taskId: string
  onProofChange: (hasProof: boolean) => void
}

export function ProofUploadArea({ taskId, onProofChange }: ProofUploadAreaProps) {
  const [proofs, setProofs] = useState<ProofData[]>([])
  const [activeTab, setActiveTab] = useState<'image' | 'transaction' | 'text'>('image')
  const [transactionHash, setTransactionHash] = useState('')
  const [textDescription, setTextDescription] = useState('')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: Upload to S3 and get URL
      const imageUrl = URL.createObjectURL(file) // Temporary for now
      
      const newProof: ProofData = {
        type: 'image',
        data: imageUrl,
        fileName: file.name
      }
      
      setProofs(prev => [...prev, newProof])
      onProofChange(true)
    }
  }

  const handleTransactionSubmit = () => {
    if (transactionHash.trim()) {
      const newProof: ProofData = {
        type: 'transaction',
        data: transactionHash.trim()
      }
      
      setProofs(prev => [...prev, newProof])
      setTransactionHash('')
      onProofChange(true)
    }
  }

  const handleTextSubmit = () => {
    if (textDescription.trim()) {
      const newProof: ProofData = {
        type: 'text',
        data: textDescription.trim()
      }
      
      setProofs(prev => [...prev, newProof])
      setTextDescription('')
      onProofChange(true)
    }
  }

  const handleRemoveProof = (index: number) => {
    setProofs(prev => {
      const newProofs = prev.filter((_, i) => i !== index)
      onProofChange(newProofs.length > 0)
      return newProofs
    })
  }

  const renderProofPreview = (proof: ProofData, index: number) => {
    switch (proof.type) {
      case 'image':
        return (
          <div key={index} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <img 
              src={proof.data} 
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
      
      case 'transaction':
        return (
          <div key={index} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <FaLink className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <p className="font-mono text-sm">{proof.data}</p>
              <p className="text-xs text-base-content/60">Transaction hash</p>
            </div>
            <button
              onClick={() => handleRemoveProof(index)}
              className="btn btn-ghost btn-sm text-error"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        )
      
      case 'text':
        return (
          <div key={index} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <FaFile className="h-6 w-6 text-info" />
            <div className="flex-1">
              <p className="text-sm line-clamp-2">{proof.data}</p>
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
          className={clsx("tab", { "tab-active": activeTab === 'transaction' })}
          onClick={() => setActiveTab('transaction')}
        >
          <FaLink className="h-4 w-4 mr-2" />
          TX Hash
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
              <FaImage className="h-8 w-8 mx-auto text-base-content/40 mb-2" />
              <p className="text-sm text-base-content/60 mb-3">
                Drag & drop an image or click to upload
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered file-input-sm w-full max-w-xs"
              />
            </div>
          </div>
        )}

        {activeTab === 'transaction' && (
          <div className="space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Transaction Hash</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="0x..."
                  className="input input-bordered flex-1"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                />
                <button
                  onClick={handleTransactionSubmit}
                  disabled={!transactionHash.trim()}
                  className="btn btn-primary"
                >
                  <FaCheck className="h-4 w-4" />
                </button>
              </div>
            </div>
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
