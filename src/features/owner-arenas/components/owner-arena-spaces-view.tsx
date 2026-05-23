"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AccessDenied } from "@/components/feedback/access-denied";
import { useMe } from "@/features/auth/hooks";
import { OwnerArenaNav } from "@/features/owner/components/owner-arena-nav";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
import { createSpaceFormSchema, type CreateSpaceFormValues } from "@/features/owner-arenas/schemas";
import { useCreateOwnerArenaSpace, useOwnerArenaSpaces } from "@/features/owner-arenas/hooks";
import type { Arena } from "@/features/arenas/types";
import { getApiErrorMessage } from "@/lib/api/error-messages";

const inputClass = "border-input bg-background min-h-11 w-full rounded-md border px-3 py-2 text-sm";

type OwnerArenaSpacesViewProps = {
  arena: Arena;
};

export function OwnerArenaSpacesView({ arena }: OwnerArenaSpacesViewProps) {
  const me = useMe();
  const spacesQuery = useOwnerArenaSpaces(arena.id);
  const createMutation = useCreateOwnerArenaSpace();
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateSpaceFormValues>({
    name: "",
    type: "quadra",
    description: "",
    status: "ACTIVE"
  });
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = spacesQuery.data ?? [];
    if (!statusFilter) return list;
    return list.filter((s) => s.status === statusFilter);
  }, [spacesQuery.data, statusFilter]);

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return <AccessDenied title="Arena de outro dono" description="Acesso negado." />;
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const parsed = createSpaceFormSchema.safeParse(form);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    const cap = parsed.data.capacitySuggestion;
    createMutation.mutate(
      {
        arenaId: arena.id,
        payload: {
          name: parsed.data.name,
          type: parsed.data.type,
          description: parsed.data.description || undefined,
          capacitySuggestion: typeof cap === "number" ? cap : undefined,
          status: parsed.data.status
        }
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setForm({ name: "", type: "quadra", description: "", status: "ACTIVE" });
        },
        onError: (error) => setMessage(getApiErrorMessage(error))
      }
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Espaços"
        description={`${arena.name} — listagem e criação de espaços.`}
        actions={<OwnerArenaNav arenaId={arena.id} />}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <Label htmlFor="space-status-filter">Filtrar status (no navegador)</Label>
          <select
            id="space-status-filter"
            className={inputClass}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
            <option value="BLOCKED">Bloqueado</option>
          </select>
        </div>
        <Button type="button" className="min-h-11" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Fechar formulário" : "Novo espaço"}
        </Button>
      </div>

      {showForm ? (
        <OwnerSectionCard title="Criar espaço">
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="space-y-2">
              <Label htmlFor="space-name">Nome *</Label>
              <input
                id="space-name"
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="space-type">Tipo *</Label>
              <input
                id="space-type"
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              />
            </div>
            <Button type="submit" className="min-h-11" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Criando…" : "Criar espaço"}
            </Button>
          </form>
        </OwnerSectionCard>
      ) : null}

      {message ? <p className="text-destructive text-sm">{message}</p> : null}

      {spacesQuery.isLoading ? <p className="text-muted-foreground text-sm">Carregando…</p> : null}
      {spacesQuery.isError ? (
        <p className="text-destructive text-sm">{getApiErrorMessage(spacesQuery.error)}</p>
      ) : null}

      {spacesQuery.isSuccess && filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhum espaço encontrado.</p>
      ) : null}

      <ul className="space-y-3">
        {filtered.map((space) => (
          <li key={space.id}>
            <article className="space-y-3 rounded-xl border p-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{space.status}</Badge>
                <span className="text-muted-foreground text-xs">{space.type}</span>
              </div>
              <h2 className="font-semibold">{space.name}</h2>
              <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                <Link href={`/owner/arenas/${arena.id}/spaces/${space.id}/slots`}>
                  Ver horários disponíveis
                </Link>
              </Button>
            </article>
          </li>
        ))}
      </ul>

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href={`/owner/arenas/${arena.id}`}>← Arena</Link>
      </Button>
    </div>
  );
}
