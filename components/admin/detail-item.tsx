import { cn } from "@/lib/utils";

export function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {typeof value === "string" ? (
        <p className="text-sm">{value}</p>
      ) : (
        <div className="text-sm">{value}</div>
      )}
    </div>
  );
}
