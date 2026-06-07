// ==========================================
// EXTRA PACK - Skeleton Loaders
// ==========================================

export function ProductCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="card overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-[var(--bg-secondary)]" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/3" />
            <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4" />
            <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-[var(--bg-secondary)] rounded w-48 mb-8" />
      <ProductCardSkeleton count={8} />
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="card p-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg bg-[var(--bg-secondary)]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4" />
              <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/2" />
              <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
