import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/features/auth/components/logout-button";

type AppLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/account", label: "Conta" },
  { href: "/account/bookings", label: "Inscrições" },
  { href: "/account/payments", label: "Pagamentos" },
  { href: "/account/notifications", label: "Notificações" },
  { href: "/events", label: "Eventos" }
] as const;

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
            Spolê
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" size="sm" asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
    </>
  );
}
