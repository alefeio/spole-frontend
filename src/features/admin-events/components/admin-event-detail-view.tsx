"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminIdCopy } from "@/features/admin/components/admin-id-copy";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminReasonDialog } from "@/features/admin/components/admin-reason-dialog";
import { AdminSectionCard } from "@/features/admin/components/admin-section-card";
import { usePatchAdminEventStatus } from "@/features/admin-events/hooks";
import { EventOriginBadge } from "@/features/events/components/event-origin-badge";
import { EventStatusBadge } from "@/features/events/components/event-status-badge";
import { EventVisibilityBadge } from "@/features/events/components/event-visibility-badge";
import type { EventDetails } from "@/features/events/types";
import { formatAdminDateTime } from "@/features/admin/utils";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type AdminEventDetailViewProps = {
  event: EventDetails;
};

function formatPrice(event: EventDetails) {
  if (event.type === "FREE") return "Gratuito";
  if (event.pricePerPerson == null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    event.pricePerPerson
  );
}

export function AdminEventDetailView({ event }: AdminEventDetailViewProps) {
  const [showCancel, setShowCancel] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const patchMutation = usePatchAdminEventStatus();

  function handleCancel(reason: string) {
    setMessage(null);
    patchMutation.mutate(
      { eventId: event.id, payload: { status: "CANCELLED", reason } },
      {
        onSuccess: () => {
          setShowCancel(false);
          setMessage("Evento cancelado.");
        },
        onError: (error) => setMessage(getApiErrorMessage(error))
      }
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader
        title={event.title}
        description="Visão administrativa somente leitura — sem edição pelo painel admin."
      />

      <AdminSectionCard>
        <div className="flex flex-wrap gap-2">
          <EventStatusBadge status={event.status} />
          <EventVisibilityBadge visibility={event.visibility} />
          <EventOriginBadge sourceType={event.sourceType} />
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Tipo</dt>
            <dd className="font-medium">{event.type}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Preço</dt>
            <dd className="font-medium">{formatPrice(event)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Início</dt>
            <dd>{formatAdminDateTime(event.startAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Término</dt>
            <dd>{formatAdminDateTime(event.endAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Cidade / UF</dt>
            <dd>
              {event.city} / {event.state}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Capacidade</dt>
            <dd className="font-medium">{event.capacity}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Endereço</dt>
            <dd>{event.addressName}</dd>
          </div>
          {event.description ? (
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Descrição</dt>
              <dd className="whitespace-pre-wrap">{event.description}</dd>
            </div>
          ) : null}
        </dl>
        <AdminIdCopy label="ID do evento" value={event.id} />
        {event.reservationId ? (
          <AdminIdCopy label="Reserva vinculada" value={event.reservationId} />
        ) : null}
      </AdminSectionCard>

      {event.status !== "CANCELLED" ? (
        <AdminSectionCard title="Ação administrativa">
          {showCancel ? (
            <AdminReasonDialog
              title="Cancelar evento"
              description="Confirme o cancelamento com motivo operacional."
              confirmLabel="Cancelar evento"
              isPending={patchMutation.isPending}
              onConfirm={handleCancel}
              onCancel={() => setShowCancel(false)}
            />
          ) : (
            <Button
              type="button"
              variant="destructive"
              className="min-h-11"
              onClick={() => setShowCancel(true)}
            >
              Cancelar evento
            </Button>
          )}
        </AdminSectionCard>
      ) : null}

      {message ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {message}
        </p>
      ) : null}

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href="/admin/events">← Voltar para eventos</Link>
      </Button>
    </div>
  );
}
