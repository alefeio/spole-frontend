import { SiteHeader } from "@/components/layout/site-header";
import { PublicAuthLink } from "@/components/layout/public-auth-link";
import type { NavItem } from "@/components/layout/nav-link";

type PublicLayoutProps = {
  children: React.ReactNode;
};

const publicNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Eventos" },
  { href: "/arenas", label: "Arenas" }
];

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader
        homeHref="/"
        navItems={publicNavItems}
        actions={<PublicAuthLink layout="inline" />}
        mobileActions={<PublicAuthLink layout="stacked" />}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
