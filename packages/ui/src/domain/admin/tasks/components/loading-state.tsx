export function LoadingState() {
  return (
    <div className="card border-base-300">
      <div className="card-body">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-4 skeleton rounded w-1/4"></div>
              <div className="h-4 skeleton rounded w-1/6"></div>
              <div className="h-4 skeleton rounded w-1/6"></div>
              <div className="h-4 skeleton rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
