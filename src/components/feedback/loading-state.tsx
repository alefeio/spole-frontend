type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Carregando…" }: LoadingStateProps) {
  return (
    <div className="text-muted-foreground flex items-center justify-center gap-2 py-12 text-sm">
      <span
        className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent"
        aria-hidden
      />
      <span>{label}</span>
    </div>
  );
}
