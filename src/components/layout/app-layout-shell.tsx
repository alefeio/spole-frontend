"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { useMe } from "@/features/auth/hooks";
import type { NavItem } from "@/components/layout/nav-link";

const BASE_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/events", label: "Eventos" },
  { href: "/account/events", label: "Meus eventos" },
  { href: "/account", label: "Conta" },
  { href: "/account/reservations", label: "Reservas" },
  { href: "/account/bookings", label: "Inscrições" },
  { href: "/account/payments", label: "Pagamentos" },
  { href: "/account/notifications", label: "Notificações" }
];

type AppLayoutShellProps = {
  children: React.ReactNode;
};

export function AppLayoutShell({ children }: AppLayoutShellProps) {
  const { data: user } = useMe();

  const navItems: NavItem[] = [...BASE_NAV];
  if (user?.role === "arena_owner") {
    navItems.splice(1, 0, { href: "/owner", label: "Painel da arena" });
  }
  if (user?.role === "admin") {
    navItems.push({ href: "/admin", label: "Admin" });
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader
        homeHref="/dashboard"
        navItems={navItems}
        actions={<LogoutButton className="min-h-9" />}
        mobileActions={<LogoutButton className="min-h-11 w-full" />}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
