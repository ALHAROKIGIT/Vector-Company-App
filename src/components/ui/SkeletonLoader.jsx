export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton h-4 ${className}`} />;
}

export function SkeletonCircle({ className = '' }) {
  return <div className={`skeleton rounded-full ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <SkeletonCircle className="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-1/3" />
          <SkeletonLine className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-4/5" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-4">
      <SkeletonCircle className="w-8 h-8" />
      <div className="flex-1 space-y-1.5">
        <SkeletonLine className="w-2/3" />
        <SkeletonLine className="w-1/3" />
      </div>
      <SkeletonLine className="w-16" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <SkeletonCard />
      <div className="glass-card p-6 space-y-3">
        <SkeletonLine className="w-1/4 h-5" />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
}

export default function SkeletonLoader({ type = 'card' }) {
  switch (type) {
    case 'dashboard':
      return <SkeletonDashboard />;
    case 'row':
      return <SkeletonRow />;
    case 'card':
    default:
      return <SkeletonCard />;
  }
}
