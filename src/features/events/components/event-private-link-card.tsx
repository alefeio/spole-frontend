"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { buildParticipantEventUrl } from "@/features/events/event-links";
import type { EventDetails } from "@/features/events/types";

type EventPrivateLinkCardProps = {
  event: Pick<EventDetails, "id" | "visibility" | "privateCode">;
};

export function EventPrivateLinkCard({ event }: EventPrivateLinkCardProps) {
  const [copied, setCopied] = useState(false);

  if (event.visibility !== "PRIVATE" || !event.privateCode) {
    return null;
  }

  const shareUrl = buildParticipantEventUrl(event.id, event.visibility, event.privateCode);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-6">
      <h2 className="text-lg font-semibold">Link privado</h2>
      <p className="text-muted-foreground text-sm">
        Compartilhe este link com o código privado. Visitantes precisam do código para acessar o
        evento.
      </p>
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium">Código privado</p>
        <p className="font-mono text-sm break-all">{event.privateCode}</p>
      </div>
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium">URL para participantes</p>
        <p className="text-sm break-all">{shareUrl}</p>
      </div>
      <Button
        type="button"
        className="min-h-11 w-full sm:min-h-9 sm:w-auto"
        onClick={() => void handleCopy()}
      >
        {copied ? "Link copiado" : "Copiar link privado"}
      </Button>
    </section>
  );
}
