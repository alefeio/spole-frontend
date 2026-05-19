"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";
import type { EventDetails } from "@/features/events/types";

type EventParticipationCtaProps = {
  event: EventDetails;
};

export function EventParticipationCta({ event }: EventParticipationCtaProps) {
  const { data: user } = useMe();

  return (
    <section className="bg-muted/40 space-y-4 rounded-xl border p-4">
      <div>
        <h2 className="font-semibold">Participação</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {user
            ? "A participação neste evento será implementada na próxima etapa."
            : "Entre ou crie sua conta para participar quando o fluxo estiver disponível."}
        </p>
      </div>

      {user ? (
        <Button type="button" disabled className="w-full">
          {event.type === "FREE" ? "Inscrição em breve" : "Reserva de vaga em breve"}
        </Button>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          <Button asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
