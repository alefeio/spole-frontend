import Link from "next/link";

type AdminStatCardProps = {
  title: string;
  value: number | string;
  href: string;
  hint?: string;
  isLoading?: boolean;
};

export function AdminStatCard({ title, value, href, hint, isLoading }: AdminStatCardProps) {
  return (
    <Link href={href} className="hover:bg-muted/40 block rounded-xl border p-4 transition-colors">
      <p className="text-muted-foreground text-sm">{title}</p>
      <p className="mt-2 text-3xl font-bold">{isLoading ? "…" : value}</p>
      {hint ? <p className="text-muted-foreground mt-1 text-xs">{hint}</p> : null}
    </Link>
  );
}
