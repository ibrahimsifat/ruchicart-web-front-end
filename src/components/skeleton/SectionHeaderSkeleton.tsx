const SectionHeaderSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="space-y-1">
        <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-md" />
      </div>
    </div>
  );
};

export default SectionHeaderSkeleton;
