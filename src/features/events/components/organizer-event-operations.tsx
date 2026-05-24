"use client";

import type { EventType } from "@/features/events/types";
import { EventBookingsPanel } from "@/features/events/components/event-bookings-panel";
import { EventPaymentsPanel } from "@/features/events/components/event-payments-panel";
import { EventSummaryCard } from "@/features/events/components/event-summary-card";

type OrganizerEventOperationsProps = {
  eventId: string;
  eventType: EventType;
};

export function OrganizerEventOperations({ eventId, eventType }: OrganizerEventOperationsProps) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        Acompanhe bookings e pagamentos deste evento conforme os dados retornados pela API.
        {eventType === "FREE" ? " Eventos gratuitos podem não gerar bookings pagos." : null}
      </p>
      <EventSummaryCard eventId={eventId} eventType={eventType} />
      {eventType === "PAID" ? (
        <>
          <EventBookingsPanel eventId={eventId} />
          <EventPaymentsPanel eventId={eventId} />
        </>
      ) : null}
    </div>
  );
}
