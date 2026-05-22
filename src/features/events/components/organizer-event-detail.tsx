"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button } from "@/components/ui/button";
import { EventOriginBadge } from "@/features/events/components/event-origin-badge";
import { EventParticipantsPanel } from "@/features/events/components/event-participants-panel";
import { EventPrivateLinkCard } from "@/features/events/components/event-private-link-card";
import { EventStatusBadge } from "@/features/events/components/event-status-badge";
import { EventVisibilityBadge } from "@/features/events/components/event-visibility-badge";
import {
  buildOrganizerEventPath,
  buildParticipantEventUrl,
  canCopyPublicCatalogLink
} from "@/features/events/event-links";
import { useCancelEvent, useUpdateEvent } from "@/features/events/hooks";
import type { EventDetails } from "@/features/events/types";
import { ApiError } from "@/lib/api/errors";
import { getApiErrorMessage, isNotFoundError } from "@/lib/api/error-messages";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatPrice(event: EventDetails) {
  if (event.type === "FREE") return "Gratuito";
  if (event.pricePerPerson == null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    event.pricePerPerson
  );
}

type OrganizerEventDetailProps = {
  event?: EventDetails;
  loadError?: unknown;
  onRetry?: () => void;
};

function OrganizerEventDetailError({
  loadError,
  onRetry
}: {
  loadError?: unknown;
  onRetry?: () => void;
}) {
  const forbidden = loadError instanceof ApiError && loadError.status === 403;
  const notFound = loadError ? isNotFoundError(loadError) : false;

  return (
    <div className="space-y-4 rounded-xl border p-6">
      <p className="text-destructive text-sm" role="alert">
        {forbidden
          ? "Você não tem permissão para gerenciar este evento."
          : notFound
            ? "Evento não encontrado."
            : loadError
              ? getApiErrorMessage(loadError)
              : "Evento não disponível."}
      </p>
      {onRetry ? (
        <Button type="button" variant="outline" className="min-h-11" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href="/account/events">← Meus eventos</Link>
      </Button>
    </div>
  );
}

function OrganizerEventDetailContent({ event }: { event: EventDetails }) {
  const router = useRouter();
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const cancelMutation = useCancelEvent();
  const updateMutation = useUpdateEvent(event.id);

  const shareUrl = buildParticipantEventUrl(event.id, event.visibility, event.privateCode);
  const canCancel = event.status !== "CANCELLED";
  const showPublishHint = event.status === "DRAFT";

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  function handlePublish() {
    setMessage(null);
    updateMutation.mutate(
      { status: "PUBLISHED" },
      {
        onSuccess: () => setMessage("Evento publicado."),
        onError: (error) => setMessage(getApiErrorMessage(error))
      }
    );
  }

  function handleCancel() {
    setMessage(null);
    cancelMutation.mutate(event.id, {
      onSuccess: () => {
        setIsConfirmingCancel(false);
        setMessage("Evento cancelado.");
        router.refresh();
      },
      onError: (error) => setMessage(getApiErrorMessage(error))
    });
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <EventStatusBadge status={event.status} />
          <EventVisibilityBadge visibility={event.visibility} />
          <EventOriginBadge sourceType={event.sourceType} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{event.title}</h1>
        {event.description ? (
          <p className="text-muted-foreground text-sm">{event.description}</p>
        ) : null}
      </header>

      <section className="space-y-4 rounded-xl border p-4 sm:p-6">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Início</dt>
            <dd className="font-medium">{formatDateTime(event.startAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Término</dt>
            <dd className="font-medium">{formatDateTime(event.endAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Local</dt>
            <dd className="font-medium">
              {event.addressName}, {event.city} – {event.state}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Capacidade</dt>
            <dd className="font-medium">{event.capacity}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tipo</dt>
            <dd className="font-medium">{event.type === "FREE" ? "Gratuito" : "Pago"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Valor</dt>
            <dd className="font-medium">{formatPrice(event)}</dd>
          </div>
          {event.reservationId ? (
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Reserva vinculada</dt>
              <dd className="font-mono text-xs break-all">{event.reservationId}</dd>
            </div>
          ) : null}
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">ID do evento</dt>
            <dd className="font-mono text-xs break-all">{event.id}</dd>
          </div>
        </dl>
      </section>

      {event.visibility === "PRIVATE" ? (
        <EventPrivateLinkCard event={event} />
      ) : (
        <section className="space-y-3 rounded-xl border p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Link para participantes</h2>
          <p className="text-sm break-all">{shareUrl}</p>
          {canCopyPublicCatalogLink(event) ? (
            <p className="text-muted-foreground text-xs">
              Evento público e publicado — aparece no catálogo em /events.
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">
              O catálogo público só lista eventos públicos e publicados.
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full sm:min-h-9 sm:w-auto"
            onClick={() => void handleCopyLink()}
          >
            {copied ? "Link copiado" : "Copiar link"}
          </Button>
        </section>
      )}

      {showPublishHint ? (
        <div className="bg-muted/40 space-y-3 rounded-lg border p-3">
          <p className="text-sm">
            Este evento está em rascunho e ainda não aparece no catálogo público.
          </p>
          <Button
            type="button"
            className="min-h-11 w-full sm:min-h-9 sm:w-auto"
            disabled={updateMutation.isPending}
            onClick={handlePublish}
          >
            {updateMutation.isPending ? "Publicando…" : "Publicar evento"}
          </Button>
        </div>
      ) : null}

      {event.type === "PAID" ? (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
          A gestão de bookings pagos deste evento será adicionada em uma etapa futura.
        </p>
      ) : (
        <EventParticipantsPanel eventId={event.id} />
      )}

      {event.sourceType === "ARENA_RESERVATION" && canCancel ? (
        <p className="text-muted-foreground text-sm">
          Ao cancelar, a API pode liberar o horário e alterar a reserva vinculada conforme regras do
          backend.
        </p>
      ) : null}

      {message ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {message}
        </p>
      ) : null}

      <div className="grid gap-3 sm:flex sm:flex-wrap">
        {canCancel ? (
          <>
            {isConfirmingCancel ? (
              <ConfirmDialog
                title="Cancelar evento"
                description="O evento será marcado como cancelado. Participantes podem perder acesso conforme regras da API."
                confirmLabel="Cancelar evento"
                isPending={cancelMutation.isPending}
                onConfirm={handleCancel}
                onCancel={() => setIsConfirmingCancel(false)}
              />
            ) : (
              <Button
                type="button"
                variant="destructive"
                className="min-h-11 w-full sm:min-h-9 sm:w-auto"
                onClick={() => setIsConfirmingCancel(true)}
              >
                Cancelar evento
              </Button>
            )}
          </>
        ) : null}

        {canCancel ? (
          <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9 sm:w-auto">
            <Link href={`${buildOrganizerEventPath(event.id)}/edit`}>Editar evento</Link>
          </Button>
        ) : null}

        <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
          <Link href="/account/events">← Meus eventos</Link>
        </Button>
      </div>
    </div>
  );
}

export function OrganizerEventDetailView({ event, loadError, onRetry }: OrganizerEventDetailProps) {
  if (loadError || !event) {
    return <OrganizerEventDetailError loadError={loadError} onRetry={onRetry} />;
  }

  return <OrganizerEventDetailContent event={event} />;
}
