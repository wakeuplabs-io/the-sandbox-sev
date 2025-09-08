import { FaPlay, FaPlus } from "react-icons/fa";
import { Link } from "@tanstack/react-router";

export function TaskExecutionHeader() {
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

      <Link to="/admin/tasks/new" className="btn btn-primary">
        <FaPlus className="h-4 w-4" />
        Create New Task
      </Link>
    </div>
  );
}
