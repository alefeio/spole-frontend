"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, type NavItem } from "@/components/layout/nav-link";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  items: NavItem[];
  actions?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNavTrigger({
  open,
  onOpenChange,
  className
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}) {
  const label = open ? "Fechar menu" : "Abrir menu";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn("size-11 shrink-0 md:hidden", className)}
      aria-expanded={open}
      aria-controls="mobile-nav-drawer"
      aria-label={label}
      onClick={() => onOpenChange(!open)}
    >
      {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
    </Button>
  );
}

export function MobileNavPanel({ items, actions, open, onOpenChange }: MobileNavProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    function onPopState() {
      onOpenChange(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
    };
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") return null;

  function close() {
    onOpenChange(false);
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] md:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        aria-label="Fechar menu"
        tabIndex={-1}
        onClick={close}
      />
      <nav
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-card absolute top-0 right-0 flex h-full w-[min(100%,20rem)] flex-col border-l shadow-2xl"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p id={titleId} className="text-sm font-semibold">
            Navegação
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10"
            aria-label="Fechar menu"
            onClick={close}
          >
            <X className="size-5" aria-hidden />
          </Button>
        </div>
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-3">
          {items.map((item) => (
            <NavLink key={item.href} {...item} onNavigate={close} orientation="vertical" />
          ))}
        </div>
        {actions ? <div className="flex w-full flex-col gap-2 border-t p-4">{actions}</div> : null}
      </nav>
    </div>,
    document.body
  );
}
