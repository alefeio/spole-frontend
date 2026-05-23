type OwnerSuccessBannerProps = {
  message: string;
};

export function OwnerSuccessBanner({ message }: OwnerSuccessBannerProps) {
  return (
    <p className="border-primary/30 bg-primary/5 rounded-lg border px-4 py-3 text-sm" role="status">
      {message}
    </p>
  );
}
