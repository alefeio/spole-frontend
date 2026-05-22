import { SiteHeader } from "@/components/layout/site-header";
import { LogoutButton } from "@/features/auth/components/logout-button";
import type { NavItem } from "@/components/layout/nav-link";

type AppLayoutProps = {
  children: React.ReactNode;
};

const appNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/events", label: "Eventos" },
  { href: "/account", label: "Conta" },
  { href: "/account/reservations", label: "Reservas" },
  { href: "/account/bookings", label: "Inscrições" },
  { href: "/account/payments", label: "Pagamentos" },
  { href: "/account/notifications", label: "Notificações" }
];

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader
        homeHref="/dashboard"
        navItems={appNavItems}
        actions={<LogoutButton className="min-h-9" />}
        mobileActions={<LogoutButton className="min-h-11 w-full" />}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
