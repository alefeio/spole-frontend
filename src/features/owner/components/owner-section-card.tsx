type OwnerSectionCardProps = {
  title?: string;
  children: React.ReactNode;
};

export function OwnerSectionCard({ title, children }: OwnerSectionCardProps) {
  return (
    <section className="space-y-4 rounded-xl border p-4 sm:p-6">
      {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}
