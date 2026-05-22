"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ArenasHubPage() {
  const router = useRouter();
  const [arenaId, setArenaId] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = arenaId.trim();
    if (!trimmed) return;
    router.push(`/arenas/${trimmed}`);
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Arenas</h1>
        <p className="text-muted-foreground text-sm">
          Arenas são acessadas por link direto. Não existe listagem global (
          <code className="bg-muted rounded px-1">GET /arenas</code> não está disponível).
        </p>
      </header>

      <section className="space-y-4 rounded-xl border p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Abrir arena pelo ID</h2>
        <p className="text-muted-foreground text-sm">
          Cole o identificador (UUID) recebido do organizador ou da documentação de desenvolvimento.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="arena-id">ID da arena</Label>
            <Input
              id="arena-id"
              name="arenaId"
              value={arenaId}
              onChange={(e) => setArenaId(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
              className="min-h-11 font-mono text-sm break-all"
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            className="min-h-11 w-full sm:min-h-9 sm:w-auto"
            disabled={!arenaId.trim()}
          >
            Ver arena
          </Button>
        </form>
      </section>

      <p className="text-muted-foreground text-sm">
        Em ambiente de desenvolvimento, IDs de seed costumam estar documentados no backend — use-os
        apenas para testes, não como catálogo do produto.
      </p>

      <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
        <Link href="/events">Explorar eventos</Link>
      </Button>
    </div>
  );
}
