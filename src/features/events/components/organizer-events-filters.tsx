"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EventCategory, OrganizerEventsListParams } from "@/features/events/types";

type OrganizerEventsFiltersProps = {
  params: OrganizerEventsListParams;
  categories: EventCategory[];
  isLoadingCategories?: boolean;
  onChange: (next: Partial<OrganizerEventsListParams>) => void;
  onClear: () => void;
};

const selectClassName = "border-input bg-background min-h-11 w-full rounded-md border px-3 text-sm";

export function OrganizerEventsFilters({
  params,
  categories,
  isLoadingCategories,
  onChange,
  onClear
}: OrganizerEventsFiltersProps) {
  const hasFilters = Boolean(
    params.q ||
    params.status ||
    params.visibility ||
    params.type ||
    params.sourceType ||
    params.categoryId
  );

  return (
    <section className="space-y-4 rounded-xl border p-4">
      <h2 className="text-sm font-semibold">Filtros</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="organizer-events-q">Busca</Label>
          <Input
            id="organizer-events-q"
            className="min-h-11"
            defaultValue={params.q ?? ""}
            placeholder="Título do evento"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onChange({ q: e.currentTarget.value.trim() || undefined, page: 1 });
              }
            }}
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value !== (params.q ?? "")) {
                onChange({ q: value || undefined, page: 1 });
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer-events-status">Status</Label>
          <select
            id="organizer-events-status"
            className={selectClassName}
            value={params.status ?? ""}
            onChange={(e) =>
              onChange({
                status: (e.target.value || undefined) as OrganizerEventsListParams["status"],
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer-events-visibility">Visibilidade</Label>
          <select
            id="organizer-events-visibility"
            className={selectClassName}
            value={params.visibility ?? ""}
            onChange={(e) =>
              onChange({
                visibility: (e.target.value ||
                  undefined) as OrganizerEventsListParams["visibility"],
                page: 1
              })
            }
          >
            <option value="">Todas</option>
            <option value="PUBLIC">Público</option>
            <option value="PRIVATE">Privado</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer-events-type">Tipo</Label>
          <select
            id="organizer-events-type"
            className={selectClassName}
            value={params.type ?? ""}
            onChange={(e) =>
              onChange({
                type: (e.target.value || undefined) as OrganizerEventsListParams["type"],
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="FREE">Gratuito</option>
            <option value="PAID">Pago</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer-events-source">Origem</Label>
          <select
            id="organizer-events-source"
            className={selectClassName}
            value={params.sourceType ?? ""}
            onChange={(e) =>
              onChange({
                sourceType: (e.target.value ||
                  undefined) as OrganizerEventsListParams["sourceType"],
                page: 1
              })
            }
          >
            <option value="">Todas</option>
            <option value="FREE_LOCATION">Local livre</option>
            <option value="ARENA_RESERVATION">Reserva de arena</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer-events-category">Categoria</Label>
          <select
            id="organizer-events-category"
            className={selectClassName}
            value={params.categoryId ?? ""}
            disabled={isLoadingCategories}
            onChange={(e) => onChange({ categoryId: e.target.value || undefined, page: 1 })}
          >
            <option value="">Todas</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

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
