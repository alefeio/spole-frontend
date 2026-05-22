"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrganizerEventsHubPage() {
  return (
    <div className="space-y-6 overflow-x-hidden">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Meus eventos</h1>
        <p className="text-muted-foreground text-sm">
          Crie e gerencie eventos que você organiza. Após criar um evento, use o link direto do
          detalhe para voltar e editar.
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-dashed p-4 sm:p-6">
        <h2 className="font-semibold">Listagem completa em breve</h2>
        <p className="text-muted-foreground text-sm">
          Você já pode criar e gerenciar eventos pelo link direto após a criação. A listagem
          completa dos seus eventos será adicionada quando a API disponibilizar um endpoint
          específico para meus eventos.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="space-y-3 rounded-xl border p-4">
          <h2 className="font-semibold">Evento em local livre</h2>
          <p className="text-muted-foreground text-sm">
            Defina data, horário e endereço do seu evento sem vincular a uma reserva de arena.
          </p>
          <Button asChild className="min-h-11 w-full sm:min-h-9">
            <Link href="/account/events/new">Criar evento em local livre</Link>
          </Button>
        </article>

        <article className="space-y-3 rounded-xl border p-4">
          <h2 className="font-semibold">Evento a partir de reserva</h2>
          <p className="text-muted-foreground text-sm">
            Use uma reserva de arena confirmada. Data, horário e local vêm da reserva.
          </p>
          <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9">
            <Link href="/account/reservations">Ver minhas reservas</Link>
          </Button>
        </article>
      </section>

      <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
        <Link href="/dashboard">← Voltar ao dashboard</Link>
      </Button>
    </div>
  );
}
