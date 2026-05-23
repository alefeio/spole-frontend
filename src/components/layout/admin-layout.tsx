import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { LogoutButton } from "@/features/auth/components/logout-button";
import type { NavItem } from "@/components/layout/nav-link";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/users", label: "Usuários" },
  { href: "/admin/events", label: "Eventos" },
  { href: "/admin/reservations", label: "Reservas" },
  { href: "/admin/payments", label: "Pagamentos" },
  { href: "/admin/arenas", label: "Arenas" },
  { href: "/admin/audit", label: "Auditoria" },
  { href: "/admin/bookings", label: "Bookings" }
];

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader
        homeHref="/admin"
        className="bg-muted/30"
        brandAddon={
          <Badge variant="accent" className="hidden sm:inline-flex">
            admin
          </Badge>
        }
        navItems={adminNavItems}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="min-h-9">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <LogoutButton />
          </div>
        }
        mobileActions={
          <div className="flex w-full flex-col gap-2">
            <Button variant="outline" asChild className="min-h-11 w-full">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <LogoutButton className="min-h-11 w-full" />
          </div>
        }
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
