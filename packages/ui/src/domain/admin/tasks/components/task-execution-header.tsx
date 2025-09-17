import { FaPlay, FaPlus, FaDownload } from "react-icons/fa";
import { Link } from "@tanstack/react-router";

interface TaskExecutionHeaderProps {
  onDownloadCSV: () => void;
  isDownloading: boolean;
  isLoading: boolean;
}

export function TaskExecutionHeader({ onDownloadCSV, isDownloading, isLoading }: TaskExecutionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="heading-1 mb-2">
          <FaPlay className="inline-block mr-3" />
          Task Execution & History
        </h1>
        <p className="text-base-content/70">
          View all tasks, upload execution proofs, and execute stored tasks in batch
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onDownloadCSV}
          disabled={isDownloading || isLoading}
          className="btn btn-outline btn-md gap-2"
        >
          <FaDownload className="h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download CSV"}
        </button>
        <Link to="/admin/tasks/new" className="btn btn-primary">
          <FaPlus className="h-4 w-4" />
          Create New Task
        </Link>
      </div>
    </div>
  );
}
