"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
        description="Gerencie sua arena, espaços, horários disponíveis e reservas recebidas."
      />

      <OwnerSectionCard>
        <p className="text-muted-foreground text-sm">
          A listagem completa das suas arenas será adicionada quando a API disponibilizar o endpoint
          de minhas arenas (<code className="text-xs">GET /users/me/arenas</code>). Por enquanto,
          crie uma nova arena ou abra uma arena pelo ID que você já possui.
        </p>
      </OwnerSectionCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/owner/arenas/new"
          className="hover:bg-muted/40 flex min-h-11 flex-col justify-center rounded-xl border p-4 transition-colors"
        >
          <p className="font-semibold">Criar nova arena</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Cadastro completo com endereço e política
          </p>
        </Link>

        <OwnerSectionCard title="Abrir arena por ID">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="open-arena-id">ID da arena</Label>
              <input
                id="open-arena-id"
                className="border-input bg-background min-h-11 w-full rounded-md border px-3 py-2 font-mono text-sm"
                value={arenaId}
                placeholder="00000000-0000-0000-0000-000000000000"
                onChange={(e) => setArenaId(e.target.value)}
              />
              {openError ? <p className="text-destructive text-sm">{openError}</p> : null}
            </div>
            <Button type="button" className="min-h-11 w-full" onClick={handleOpenArena}>
              Abrir arena
            </Button>
          </div>
        </OwnerSectionCard>
      </div>
    </div>
  );
}
