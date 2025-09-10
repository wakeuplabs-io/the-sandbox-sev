interface RowCountDisplayProps {
  rowCount: number;
}

export function RowCountDisplay({ rowCount }: RowCountDisplayProps) {
  if (rowCount === 0) return null;

  return (
    <div className="text-sm text-base-content/70">
      Detected {rowCount} row{rowCount !== 1 ? "s" : ""} of data
    </div>
  );
}
