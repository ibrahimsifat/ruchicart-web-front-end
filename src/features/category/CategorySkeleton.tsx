export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 rounded-lg bg-gray-500 animate-pulse" />
      ))}
    </div>
  );
}
