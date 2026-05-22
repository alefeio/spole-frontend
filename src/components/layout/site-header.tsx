"use client";

import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { MobileNavPanel, MobileNavTrigger } from "@/components/layout/mobile-nav";
import { NavLink, type NavItem } from "@/components/layout/nav-link";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  homeHref: string;
  navItems: NavItem[];
  /** Ações visíveis apenas no desktop (md+). */
  actions?: React.ReactNode;
  /** Ações no drawer mobile; se omitido, o menu não repete `actions`. */
  mobileActions?: React.ReactNode;
  brandAddon?: React.ReactNode;
  className?: string;
};

export function SiteHeader({
  homeHref,
  navItems,
  actions,
  mobileActions,
  brandAddon,
  className
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "bg-card/95 supports-[backdrop-filter]:bg-card/80 sticky top-0 z-40 border-b backdrop-blur",
          className
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:h-16 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <BrandLogo href={homeHref} size="compact" priority />
            {brandAddon}
          </div>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} orientation="horizontal" />
            ))}
          </nav>

          {actions ? (
            <div className="hidden shrink-0 items-center gap-2 md:flex">{actions}</div>
          ) : null}

          <MobileNavTrigger open={mobileOpen} onOpenChange={setMobileOpen} />
        </div>
      </header>

      <MobileNavPanel
        items={navItems}
        actions={mobileActions ?? actions}
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      />
    </>
  );
}
