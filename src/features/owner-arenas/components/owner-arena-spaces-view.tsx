"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AccessDenied } from "@/components/feedback/access-denied";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/feedback/section-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMe } from "@/features/auth/hooks";
import { OWNER_INPUT_CLASS } from "@/features/owner/components/owner-constants";
import { OwnerArenaNavigation } from "@/features/owner/components/owner-arena-navigation";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
import { OwnerSuccessBanner } from "@/features/owner/components/owner-success-banner";
import { OwnerSpaceStatusBadge } from "@/features/owner-arenas/components/owner-space-status-badge";
import { createSpaceFormSchema, type CreateSpaceFormValues } from "@/features/owner-arenas/schemas";
import { useCreateOwnerArenaSpace, useOwnerArenaSpaces } from "@/features/owner-arenas/hooks";
import type { Arena } from "@/features/arenas/types";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type OwnerArenaSpacesViewProps = {
  arena: Arena;
};

const defaultForm: CreateSpaceFormValues = {
  name: "",
  type: "quadra",
  description: "",
  capacitySuggestion: undefined,
  status: "ACTIVE"
};

export function OwnerArenaSpacesView({ arena }: OwnerArenaSpacesViewProps) {
  const me = useMe();
  const spacesQuery = useOwnerArenaSpaces(arena.id);
  const createMutation = useCreateOwnerArenaSpace();
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateSpaceFormValues>(defaultForm);
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setSuccessMessage(null);
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
          setForm(defaultForm);
          setSuccessMessage("Espaço criado com sucesso.");
        },
        onError: (error) => setMessage(getApiErrorMessage(error))
      }
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Espaços"
        description={`${arena.name} — cadastre espaços antes de disponibilizar horários.`}
      />

      <OwnerArenaNavigation arenaId={arena.id} />

      <p className="text-muted-foreground text-sm">
        Cada espaço pode ter horários disponíveis. Abra um espaço e use &quot;Ver horários&quot;
        para cadastrar slots.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor="space-status-filter">Filtrar por status (na lista carregada)</Label>
          <select
            id="space-status-filter"
            className={OWNER_INPUT_CLASS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
            <option value="BLOCKED">Bloqueado</option>
          </select>
        </div>
        <Button type="button" className="min-h-11 shrink-0" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Fechar formulário" : "Criar espaço"}
        </Button>
      </div>

      {successMessage ? <OwnerSuccessBanner message={successMessage} /> : null}
      {message ? (
        <p className="text-destructive text-sm" role="alert">
          {message}
        </p>
      ) : null}

      {showForm ? (
        <OwnerSectionCard title="Novo espaço">
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="space-y-2">
              <Label htmlFor="space-name">Nome *</Label>
              <input
                id="space-name"
                className={OWNER_INPUT_CLASS}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="space-type">Tipo *</Label>
              <input
                id="space-type"
                className={OWNER_INPUT_CLASS}
                placeholder="Ex.: quadra, salão"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="space-description">Descrição</Label>
              <textarea
                id="space-description"
                className={`${OWNER_INPUT_CLASS} min-h-24`}
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="space-capacity">Capacidade sugerida</Label>
              <input
                id="space-capacity"
                type="number"
                min={1}
                className={OWNER_INPUT_CLASS}
                value={form.capacitySuggestion ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    capacitySuggestion: e.target.value === "" ? undefined : Number(e.target.value)
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="space-status">Status inicial</Label>
              <select
                id="space-status"
                className={OWNER_INPUT_CLASS}
                value={form.status ?? "ACTIVE"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as CreateSpaceFormValues["status"]
                  }))
                }
              >
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
                <option value="BLOCKED">Bloqueado</option>
              </select>
            </div>
            <Button type="submit" className="min-h-11 w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Criando…" : "Criar espaço"}
            </Button>
          </form>
        </OwnerSectionCard>
      ) : null}

      {spacesQuery.isLoading ? <CardsSkeleton count={2} /> : null}
      {spacesQuery.isError ? (
        <ErrorState
          title="Erro ao carregar espaços"
          error={spacesQuery.error}
          onRetry={() => void spacesQuery.refetch()}
        />
      ) : null}

      {spacesQuery.isSuccess && filtered.length === 0 ? (
        <EmptyState
          title={statusFilter ? "Nenhum espaço com esse status" : "Nenhum espaço cadastrado"}
          description={
            statusFilter
              ? "Altere o filtro ou cadastre um novo espaço."
              : "Crie o primeiro espaço para disponibilizar horários."
          }
        />
      ) : null}

      <ul className="space-y-3">
        {filtered.map((space) => (
          <li key={space.id}>
            <article className="space-y-3 rounded-xl border p-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold break-words">{space.name}</h2>
                <OwnerSpaceStatusBadge status={space.status} />
              </div>
              <p className="text-muted-foreground text-sm">
                Tipo: <span className="text-foreground font-medium">{space.type}</span>
              </p>
              {space.description ? (
                <p className="text-sm break-words">{space.description}</p>
              ) : null}
              {space.capacitySuggestion != null ? (
                <p className="text-muted-foreground text-sm">
                  Capacidade sugerida: {space.capacitySuggestion}
                </p>
              ) : null}
              <Button asChild className="min-h-11 w-full sm:w-auto">
                <Link href={`/owner/arenas/${arena.id}/spaces/${space.id}/slots`}>
                  Ver horários
                </Link>
              </Button>
            </article>
          </li>
        ))}
      </ul>

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href={`/owner/arenas/${arena.id}`}>← Visão geral da arena</Link>
      </Button>
    </div>
  );
}
