interface DashboardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function DashboardHeader({
  title,
  description,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold  text-black capitalize">
          {title}
        </h2>
        {description && (
          <p className="text-base text-black/40 capitalize ">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
