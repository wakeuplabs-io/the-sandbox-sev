interface BatchActionsProps {
  hasChanges: boolean;
  onSave: () => void;
  isSaving: boolean;
}

export function BatchActions({ hasChanges, onSave, isSaving }: BatchActionsProps) {
  console.log("BatchActions", { hasChanges, onSave, isSaving });
  return (
    <div className="bg-base-200 p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Batch Actions</h3>
          {hasChanges && (
            <div className="badge badge-warning">
              Changes pending
            </div>
          )}
        </div>
        
        <button
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          className={`btn ${hasChanges ? 'btn-primary' : 'btn-disabled'}`}
        >
          {isSaving ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>
      
      {hasChanges && (
        <p className="text-sm text-base-content/70 mt-2">
          You have unsaved changes. Click "Save Changes" to apply them.
        </p>
      )}
    </div>
  );
}
