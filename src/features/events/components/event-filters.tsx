"use client";

import { Button } from "@/components/ui/button";
import { EventSearchInput } from "@/features/events/components/event-search-input";
import type { EventCategory } from "@/features/events/types";

type EventFiltersProps = {
  q?: string;
  category?: string;
  categories: EventCategory[];
  isLoadingCategories?: boolean;
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;
};

export function EventFilters({
  q,
  category,
  categories,
  isLoadingCategories,
  onSearch,
  onCategoryChange,
  onClear
}: EventFiltersProps) {
  const hasFilters = Boolean(q || category);

  return (
    <section className="bg-card rounded-xl border p-4 shadow-xs">
      <div className="grid gap-4 lg:grid-cols-[1fr_260px_auto] lg:items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="event-search">
            Busca
          </label>
          <EventSearchInput id="event-search" defaultValue={q} onSearch={onSearch} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="event-category">
            Categoria
          </label>
          <select
            id="event-category"
            value={category ?? ""}
            disabled={isLoadingCategories}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:outline-none disabled:opacity-50 lg:h-9"
          >
            <option value="">Todas</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="button"
          variant="outline"
          className="min-h-11 lg:min-h-9"
          onClick={onClear}
          disabled={!hasFilters}
        >
          Limpar
        </Button>
      </div>
    </section>
  );
}
