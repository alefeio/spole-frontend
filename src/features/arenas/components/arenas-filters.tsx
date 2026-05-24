"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PublicArenasListParams } from "@/features/arenas/types";

type ArenasFiltersProps = {
  params: PublicArenasListParams;
  hasFilters: boolean;
  onChange: (next: Partial<PublicArenasListParams>) => void;
  onClear: () => void;
};

export function ArenasFilters({ params, hasFilters, onChange, onClear }: ArenasFiltersProps) {
  const [qDraft, setQDraft] = useState(params.q ?? "");

  function applySearch() {
    const v = qDraft.trim();
    if (v !== (params.q ?? "")) onChange({ q: v || undefined, page: 1 });
  }

  return (
    <section className="space-y-4 rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Buscar arenas</h2>
        {hasFilters ? (
          <Button type="button" variant="ghost" className="min-h-11" onClick={onClear}>
            Limpar filtros
          </Button>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 sm:col-span-2 lg:col-span-4">
          <Label htmlFor="arenas-q">Nome, cidade ou endereço</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="arenas-q"
              className="min-h-11"
              value={qDraft}
              placeholder="Ex.: futebol, São Paulo, centro"
              onChange={(e) => setQDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch();
              }}
            />
            <Button type="button" className="min-h-11 shrink-0" onClick={applySearch}>
              Buscar
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="arenas-city">Cidade</Label>
          <Input
            id="arenas-city"
            className="min-h-11"
            value={params.city ?? ""}
            onChange={(e) => onChange({ city: e.target.value.trim() || undefined, page: 1 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arenas-state">UF</Label>
          <Input
            id="arenas-state"
            className="min-h-11 uppercase"
            maxLength={2}
            value={params.state ?? ""}
            onChange={(e) =>
              onChange({ state: e.target.value.trim().toUpperCase() || undefined, page: 1 })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arenas-district">Bairro</Label>
          <Input
            id="arenas-district"
            className="min-h-11"
            value={params.district ?? ""}
            onChange={(e) => onChange({ district: e.target.value.trim() || undefined, page: 1 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arenas-sort">Ordenar</Label>
          <select
            id="arenas-sort"
            className="border-input bg-background min-h-11 w-full rounded-md border px-3 text-sm"
            value={`${params.sort ?? "updatedAt"}:${params.order ?? "desc"}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split(":") as [
                PublicArenasListParams["sort"],
                PublicArenasListParams["order"]
              ];
              onChange({ sort, order, page: 1 });
            }}
          >
            <option value="updatedAt:desc">Mais recentes</option>
            <option value="updatedAt:asc">Mais antigas</option>
            <option value="name:asc">Nome (A–Z)</option>
            <option value="name:desc">Nome (Z–A)</option>
            <option value="createdAt:desc">Cadastro recente</option>
          </select>
        </div>
      </div>
    </section>
  );
}
