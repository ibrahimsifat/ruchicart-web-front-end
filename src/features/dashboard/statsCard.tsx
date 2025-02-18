import { Card } from "@/components/ui/card";

interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number | undefined;
  label: string;
}

export function StatsCard({ icon, value, label }: StatsCardProps) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/20">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </Card>
  );
}
