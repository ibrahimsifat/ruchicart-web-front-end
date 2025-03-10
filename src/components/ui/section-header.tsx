interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center gap-4 mb-8">
      <div className="space-y-1">
        <h2 className="md:text-2xl font-bold tracking-tight text-xl">
          {title}
        </h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <div className="cursor-pointer hover:text-primary">{action}</div>
      )}
    </div>
  );
}
