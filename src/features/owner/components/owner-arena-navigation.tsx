"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type OwnerArenaNavigationProps = {
  arenaId: string;
};

type NavItem = {
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
};

function buildItems(arenaId: string): NavItem[] {
  const base = `/owner/arenas/${arenaId}`;
  return [
    {
      label: "Visão geral",
      href: base,
      isActive: (pathname) => pathname === base
    },
    {
      label: "Espaços",
      href: `${base}/spaces`,
      isActive: (pathname) => pathname.startsWith(`${base}/spaces`) && !pathname.includes("/slots")
    },
    {
      label: "Horários",
      href: `${base}/spaces`,
      isActive: (pathname) => pathname.includes("/slots")
    },
    {
      label: "Reservas",
      href: `${base}/reservations`,
      isActive: (pathname) =>
        pathname.startsWith(`${base}/reservations`) && !pathname.includes("/agenda")
    },
    {
      label: "Agenda",
      href: `${base}/agenda`,
      isActive: (pathname) => pathname === `${base}/agenda`
    },
    {
      label: "Editar",
      href: `${base}/edit`,
      isActive: (pathname) => pathname === `${base}/edit`
    }
  ];
}

export function OwnerArenaNavigation({ arenaId }: OwnerArenaNavigationProps) {
  const pathname = usePathname();
  const items = buildItems(arenaId);

  return (
    <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Navegação da arena">
      {items.map((item) => {
        const active = item.isActive(pathname);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "focus-visible:ring-ring shrink-0 rounded-full border px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-foreground hover:bg-muted/60"
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
