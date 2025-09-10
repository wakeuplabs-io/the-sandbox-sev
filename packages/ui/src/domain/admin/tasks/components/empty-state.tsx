export function EmptyState() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body text-center">
        <h3 className="text-lg font-semibold text-base-content/70">No tasks found</h3>
        <p className="text-base-content/50">No tasks match your current filters.</p>
      </div>
    </div>
  );
}
