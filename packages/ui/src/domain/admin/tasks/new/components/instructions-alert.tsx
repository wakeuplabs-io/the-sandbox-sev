import { FaInfoCircle } from "react-icons/fa";

interface InstructionsAlertProps {
  maxBatchSize: number;
}

export function InstructionsAlert({ maxBatchSize }: InstructionsAlertProps) {
  return (
    <div className="alert alert-info">
      <FaInfoCircle className="stroke-current shrink-0 w-6 h-6" />
      <div>
        <h3 className="font-bold">Instructions</h3>
        <div className="text-xs">
          <p>1. Copy multiple rows from your Excel file</p>
          <p>2. Paste them in the textarea above</p>
          <p>3. The system will automatically parse and validate the data</p>
          <p>4. Review the preview table below before submitting</p>
          <p className="text-warning">⚠️ Maximum {maxBatchSize} tasks per batch</p>
        </div>
      </div>
    </div>
  );
}
