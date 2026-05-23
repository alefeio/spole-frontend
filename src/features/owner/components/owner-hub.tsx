"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OWNER_INPUT_CLASS } from "@/features/owner/components/owner-constants";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const FLOW_STEPS = [
  "Cadastre ou abra sua arena",
  "Crie espaços (quadras, salas, etc.)",
  "Cadastre horários disponíveis em cada espaço",
  "Acompanhe reservas recebidas na agenda"
] as const;

export function OwnerHub() {
  const router = useRouter();
  const [arenaId, setArenaId] = useState("");
  const [openError, setOpenError] = useState<string | null>(null);

  function handleOpenArena() {
    const id = arenaId.trim();
    if (!UUID_RE.test(id)) {
      setOpenError("Informe um ID de arena válido (UUID).");
      return;
    }
    setOpenError(null);
    router.push(`/owner/arenas/${id}`);
  }

  return (
    <div className="space-y-8 overflow-x-hidden">
      <OwnerPageHeader
        title="Painel da arena"
        description="Operação diária: arenas, espaços, horários disponíveis e reservas recebidas."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/owner/arenas"
          className="border-primary/30 bg-primary/5 hover:bg-primary/10 flex min-h-11 flex-col justify-center rounded-xl border-2 p-4 transition-colors"
        >
          <p className="text-lg font-semibold">Minhas arenas</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Listagem com filtros e atalhos para cada arena
          </p>
        </Link>

        <Link
          href="/owner/arenas/new"
          className="hover:bg-muted/40 flex min-h-11 flex-col justify-center rounded-xl border p-4 transition-colors"
        >
          <p className="font-semibold">Criar nova arena</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Cadastro com endereço e política de reserva
          </p>
        </Link>
      </div>

      <OwnerSectionCard title="Como começar">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          {FLOW_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </OwnerSectionCard>

      <OwnerSectionCard title="Abrir arena por ID">
        <p className="text-muted-foreground text-sm">
          Recurso de suporte quando você já possui o identificador da arena.
        </p>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="open-arena-id">ID da arena</Label>
            <input
              id="open-arena-id"
              className={`${OWNER_INPUT_CLASS} font-mono break-all`}
              value={arenaId}
              placeholder="00000000-0000-0000-0000-000000000000"
              onChange={(e) => setArenaId(e.target.value)}
            />
            {openError ? <p className="text-destructive text-sm">{openError}</p> : null}
          </div>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full"
            onClick={handleOpenArena}
          >
            Abrir arena
          </Button>
        </div>
      </OwnerSectionCard>
    </div>
  );
}
