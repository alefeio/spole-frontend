"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
};

type NavLinkProps = NavItem & {
  onNavigate?: () => void;
  className?: string;
  /** horizontal — barra desktop; vertical — drawer mobile */
  orientation?: "horizontal" | "vertical";
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/account") return pathname === "/account";
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({
  href,
  label,
  onNavigate,
  className,
  orientation = "vertical"
}: NavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={() => onNavigate?.()}
      className={cn(
        "focus-visible:ring-ring rounded-md text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
        orientation === "vertical"
          ? "flex min-h-11 items-center px-3 py-2.5"
          : "inline-flex min-h-9 items-center px-3 py-2",
        active
          ? "bg-primary/10 text-primary"
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
