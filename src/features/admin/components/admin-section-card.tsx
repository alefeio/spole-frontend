type AdminSectionCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminSectionCard({ title, children, className = "" }: AdminSectionCardProps) {
  return (
    <section className={`space-y-4 rounded-xl border p-4 sm:p-6 ${className}`}>
      {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}
