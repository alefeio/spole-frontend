import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicAuthLink } from "@/components/layout/public-auth-link";

type PublicLayoutProps = {
  children: React.ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Spolê
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/events">Eventos</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/arenas">Arenas</Link>
            </Button>
            <PublicAuthLink />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
