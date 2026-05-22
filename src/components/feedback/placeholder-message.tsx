type PlaceholderMessageProps = {
  title: string;
  description?: string;
};

export function PlaceholderMessage({ title, description }: PlaceholderMessageProps) {
  return (
    <section className="bg-accent/40 rounded-xl border border-dashed p-8 text-center shadow-xs">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="text-muted-foreground mx-auto mt-2 max-w-lg text-sm">{description}</p>
      ) : null}
    </section>
  );
}
