"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { OwnerArenasListParams } from "@/features/owner-arenas/types";

const inputClass = "border-input bg-background min-h-11 w-full rounded-md border px-3 py-2 text-sm";

type OwnerArenasFiltersProps = {
  params: OwnerArenasListParams;
  hasFilters: boolean;
  onChange: (next: Partial<OwnerArenasListParams>) => void;
  onClear: () => void;
};

export function OwnerArenasFilters({
  params,
  hasFilters,
  onChange,
  onClear
}: OwnerArenasFiltersProps) {
  return (
    <section className="space-y-4 rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Filtros</h2>
        {hasFilters ? (
          <Button type="button" variant="ghost" className="min-h-11" onClick={onClear}>
            Limpar
          </Button>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="owner-arenas-q">Busca (nome, slug ou cidade)</Label>
          <input
            id="owner-arenas-q"
            className={inputClass}
            defaultValue={params.q ?? ""}
            placeholder="Ex.: central, spole"
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.q ?? "")) onChange({ q: v || undefined, page: 1 });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-arenas-city">Cidade</Label>
          <input
            id="owner-arenas-city"
            className={inputClass}
            defaultValue={params.city ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.city ?? "")) onChange({ city: v || undefined, page: 1 });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-arenas-status">Status</Label>
          <select
            id="owner-arenas-status"
            className={inputClass}
            value={params.status ?? ""}
            onChange={(e) =>
              onChange({
                status: (e.target.value || undefined) as OwnerArenasListParams["status"],
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Ativa</option>
            <option value="INACTIVE">Inativa</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-arenas-sort">Ordenar por</Label>
          <select
            id="owner-arenas-sort"
            className={inputClass}
            value={params.sort ?? "createdAt"}
            onChange={(e) =>
              onChange({
                sort: e.target.value as OwnerArenasListParams["sort"],
                page: 1
              })
            }
          >
            <option value="createdAt">Criação</option>
            <option value="updatedAt">Atualização</option>
            <option value="name">Nome</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-arenas-order">Ordem</Label>
          <select
            id="owner-arenas-order"
            className={inputClass}
            value={params.order ?? "desc"}
            onChange={(e) =>
              onChange({
                order: e.target.value as OwnerArenasListParams["order"],
                page: 1
              })
            }
          >
            <option value="desc">Mais recentes primeiro</option>
            <option value="asc">Mais antigas primeiro</option>
          </select>
        </div>
      </div>
    </section>
  );
}
