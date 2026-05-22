"use client";

import { ApiError } from "@/lib/api/errors";
import { getApiErrorMessage } from "@/lib/api/error-messages";
import { useEventParticipants } from "@/features/events/hooks";

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

type EventParticipantsPanelProps = {
  eventId: string;
};

export function EventParticipantsPanel({ eventId }: EventParticipantsPanelProps) {
  const query = useEventParticipants(eventId);

  if (query.isLoading) {
    return (
      <section className="space-y-3 rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Participantes gratuitos</h2>
        <p className="text-muted-foreground text-sm">Carregando inscrições…</p>
      </section>
    );
  }

  if (query.isError) {
    const forbidden = query.error instanceof ApiError && query.error.status === 403;
    return (
      <section className="space-y-3 rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Participantes gratuitos</h2>
        <p className="text-destructive text-sm" role="alert">
          {forbidden
            ? "Você não tem permissão para ver os participantes deste evento."
            : getApiErrorMessage(query.error)}
        </p>
      </section>
    );
  }

  const participants = query.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold">Participantes gratuitos</h2>
        <p className="text-muted-foreground text-sm">
          Inscrições confirmadas via endpoint de participantes gratuitos.
        </p>
      </div>

      {participants.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
          Nenhum participante inscrito ainda.
        </p>
      ) : (
        <ul className="space-y-3">
          {participants.map((participant) => (
            <li key={participant.id} className="space-y-2 rounded-lg border p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{participant.status}</span>
                <span className="text-muted-foreground text-xs">
                  {formatDateTime(participant.createdAt)}
                </span>
              </div>
              <p className="text-muted-foreground font-mono text-xs break-all">
                Usuário: {participant.userId}
              </p>
              <p className="text-muted-foreground font-mono text-xs break-all">
                Inscrição: {participant.id}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
