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

/**
 * Os campos usam estado local (draft). A sincronização com a URL (limpar
 * filtros / navegação direta) é feita pelo `key` no componente pai, que
 * remonta este formulário e reinicializa os drafts a partir de `params`.
 */
export function ArenasFilters({ params, hasFilters, onChange, onClear }: ArenasFiltersProps) {
  const [qDraft, setQDraft] = useState(params.q ?? "");
  const [cityDraft, setCityDraft] = useState(params.city ?? "");
  const [stateDraft, setStateDraft] = useState(params.state ?? "");
  const [districtDraft, setDistrictDraft] = useState(params.district ?? "");

  function applyFilters() {
    onChange({
      q: qDraft.trim() || undefined,
      city: cityDraft.trim() || undefined,
      state: stateDraft.trim().toUpperCase() || undefined,
      district: districtDraft.trim() || undefined,
      page: 1
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    }
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
          <Input
            id="arenas-q"
            className="min-h-11"
            value={qDraft}
            placeholder="Ex.: futebol, São Paulo, centro"
            onChange={(e) => setQDraft(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arenas-city">Cidade</Label>
          <Input
            id="arenas-city"
            className="min-h-11"
            value={cityDraft}
            onChange={(e) => setCityDraft(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arenas-state">UF</Label>
          <Input
            id="arenas-state"
            className="min-h-11 uppercase"
            maxLength={2}
            value={stateDraft}
            onChange={(e) => setStateDraft(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arenas-district">Bairro</Label>
          <Input
            id="arenas-district"
            className="min-h-11"
            value={districtDraft}
            onChange={(e) => setDistrictDraft(e.target.value)}
            onKeyDown={handleKeyDown}
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
      <div className="flex justify-end">
        <Button type="button" className="min-h-11 w-full sm:w-auto" onClick={applyFilters}>
          Aplicar filtros
        </Button>
      </div>
    </section>
  );
}
