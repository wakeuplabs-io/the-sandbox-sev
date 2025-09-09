import { FaPlay } from "react-icons/fa";
import { TaskStateEnum } from "@/shared/constants";
import type { Task } from "@the-sandbox-sev/api";

interface TaskActionButtonsProps {
  task: Task;
  hasProof: boolean;
  isExecuting: boolean;
  onExecute: () => void;
}

export function TaskActionButtons({ 
  task, 
  hasProof, 
  isExecuting, 
  onExecute 
}: TaskActionButtonsProps) {
  // Early return si no hay proof
  if (!hasProof) return null;

  const canExecute = task.state === TaskStateEnum.STORED;
  const isExecuted = task.state === TaskStateEnum.EXECUTED;

  // Early return si no es un estado válido para mostrar botones
  if (!canExecute && !isExecuted) return null;

  return (
    <div className="flex justify-end pt-2">
      {canExecute ? (
        <ExecuteButton onExecute={onExecute} isExecuting={isExecuting} />
      ) : (
        <AddProofButton onExecute={onExecute} isExecuting={isExecuting} />
      )}
    </div>
  );
}

function ExecuteButton({ onExecute, isExecuting }: { onExecute: () => void, isExecuting: boolean }) {
  return (
    <button 
      onClick={onExecute} 
      className="btn btn-primary btn-sm"
      disabled={isExecuting}
      aria-label="Execute this task"
    >
      <FaPlay className="h-4 w-4 mr-2" />
      {isExecuting ? 'Executing...' : 'Execute This Task'}
    </button>
  );
}

function AddProofButton({ 
  onExecute, 
  isExecuting 
}: { 
  onExecute: () => void;
  isExecuting: boolean;
}) {
  return (
    <button 
      onClick={onExecute} 
      className="btn btn-secondary btn-sm"
      disabled={isExecuting}
      aria-label={isExecuting ? "Adding proof to executed task" : "Add proof to executed task"}
    >
      <FaPlay className="h-4 w-4 mr-2" />
      {isExecuting ? 'Adding Proof...' : 'Add Proof to Executed Task'}
    </button>
  );
}
