"use client";

import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button } from "@/components/ui/button";
import { EventOriginBadge } from "@/features/events/components/event-origin-badge";
import { EventStatusBadge } from "@/features/events/components/event-status-badge";
import { EventTypeBadge } from "@/features/events/components/event-type-badge";
import { EventVisibilityBadge } from "@/features/events/components/event-visibility-badge";
import { buildOrganizerEventPath } from "@/features/events/event-links";
import { useCancelEvent, useUpdateEvent } from "@/features/events/hooks";
import type { OrganizerEventListItem } from "@/features/events/types";
import { getApiErrorMessage } from "@/lib/api/error-messages";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

type OrganizerEventCardProps = {
  event: OrganizerEventListItem;
};

export function OrganizerEventCard({ event }: OrganizerEventCardProps) {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const cancelMutation = useCancelEvent();
  const updateMutation = useUpdateEvent(event.id);

  const canCancel = event.status !== "CANCELLED";
  const canPublish = event.status === "DRAFT";
  const detailPath = buildOrganizerEventPath(event.id);
  const editPath = `${detailPath}/edit`;

  function handlePublish() {
    setActionMessage(null);
    updateMutation.mutate(
      { status: "PUBLISHED" },
      {
        onSuccess: () => setActionMessage("Evento publicado."),
        onError: (error) => setActionMessage(getApiErrorMessage(error))
      }
    );
  }

  function handleCancel() {
    setActionMessage(null);
    cancelMutation.mutate(event.id, {
      onSuccess: () => {
        setIsConfirmingCancel(false);
        setActionMessage("Evento cancelado.");
      },
      onError: (error) => setActionMessage(getApiErrorMessage(error))
    });
  }

  const isPending = cancelMutation.isPending || updateMutation.isPending;

  return (
    <article className="flex flex-col gap-4 rounded-xl border p-4 sm:p-5">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <EventStatusBadge status={event.status} />
          <EventVisibilityBadge visibility={event.visibility} />
          <EventOriginBadge sourceType={event.sourceType} />
          <EventTypeBadge type={event.type} />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">{event.title}</h2>
      </div>

      <dl className="text-muted-foreground grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt>Quando</dt>
          <dd className="text-foreground text-right font-medium">
            {formatDateTime(event.startAt)} – {formatDateTime(event.endAt)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Local</dt>
          <dd className="text-foreground text-right font-medium">
            {[event.city, event.state].filter(Boolean).join(" – ") || "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Capacidade</dt>
          <dd className="text-foreground font-medium">{event.capacity}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Valor</dt>
          <dd className="text-foreground font-medium">
            {event.type === "FREE"
              ? "Gratuito"
              : event.pricePerPerson != null
                ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                    event.pricePerPerson
                  )
                : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Atualizado</dt>
          <dd className="text-foreground text-right font-medium">
            {formatDateTime(event.updatedAt)}
          </dd>
        </div>
      </dl>

      {actionMessage ? (
        <p className="bg-muted rounded-lg border p-2 text-sm" role="status">
          {actionMessage}
        </p>
      ) : null}

      {isConfirmingCancel ? (
        <ConfirmDialog
          title="Cancelar evento"
          description={`Cancelar "${event.title}"? Esta ação usa a API e pode afetar reservas vinculadas.`}
          confirmLabel="Cancelar evento"
          isPending={cancelMutation.isPending}
          onConfirm={handleCancel}
          onCancel={() => setIsConfirmingCancel(false)}
        />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          <Button asChild variant="outline" className="min-h-11">
            <Link href={detailPath}>Ver detalhes</Link>
          </Button>
          {canCancel ? (
            <Button asChild variant="outline" className="min-h-11">
              <Link href={editPath}>Editar</Link>
            </Button>
          ) : null}
          {canPublish ? (
            <Button
              type="button"
              className="min-h-11 sm:col-span-2"
              disabled={isPending}
              onClick={handlePublish}
            >
              {updateMutation.isPending ? "Publicando…" : "Publicar"}
            </Button>
          ) : null}
          {canCancel ? (
            <Button
              type="button"
              variant="destructive"
              className="min-h-11 sm:col-span-2"
              disabled={isPending}
              onClick={() => setIsConfirmingCancel(true)}
            >
              Cancelar evento
            </Button>
          ) : null}
        </div>
      )}
    </article>
  );
}
