"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const adminSelectClassName =
  "border-input bg-background min-h-11 w-full rounded-md border px-3 text-sm";

export const adminInputClassName =
  "border-input bg-background min-h-11 w-full rounded-md border px-3 text-sm";

type AdminFiltersBarProps = {
  title?: string;
  hasFilters?: boolean;
  onClear: () => void;
  children: React.ReactNode;
};

export function AdminFiltersBar({
  title = "Filtros",
  hasFilters,
  onClear,
  children
}: AdminFiltersBarProps) {
  return (
    <section className="space-y-4 rounded-xl border p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      <Button
        type="button"
        variant="outline"
        className="min-h-11 w-full sm:min-h-9 sm:w-auto"
        disabled={!hasFilters}
        onClick={onClear}
      >
        Limpar filtros
      </Button>
    </section>
  );
}

export function AdminFilterField({
  label,
  htmlFor,
  children
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
