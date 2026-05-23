type OwnerPageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function OwnerPageHeader({ title, description, actions }: OwnerPageHeaderProps) {
  return (
    <header className="space-y-3 sm:flex sm:items-start sm:justify-between sm:gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>
      {actions ? <div className="grid gap-2 sm:shrink-0">{actions}</div> : null}
    </header>
  );
}
