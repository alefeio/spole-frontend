"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArenaReservationSummary,
  EventFormFields,
  FreeLocationFields
} from "@/features/events/components/event-form-fields";
import { isoToDateTimeLocal } from "@/features/events/datetime";
import {
  arenaReservationFormSchema,
  freeLocationFormSchema,
  parseArenaReservationFormToPayload,
  parseFreeLocationFormToPayload,
  parseUpdateFormToPayload,
  updateEventFormSchema
} from "@/features/events/schemas";
import type { EventCategory, EventDetails } from "@/features/events/types";
import { getApiErrorMessage } from "@/lib/api/error-messages";

export type EventFormMode =
  | { kind: "create-free" }
  | { kind: "create-arena"; reservationId: string; slotLabel: string; locationLabel: string }
  | { kind: "edit"; event: EventDetails };

type EventFormProps = {
  mode: EventFormMode;
  categories: EventCategory[];
  isPending?: boolean;
  onSubmitCreateFree: (payload: ReturnType<typeof parseFreeLocationFormToPayload>) => void;
  onSubmitCreateArena: (payload: ReturnType<typeof parseArenaReservationFormToPayload>) => void;
  onSubmitUpdate: (payload: ReturnType<typeof parseUpdateFormToPayload>) => void;
};

function zodFieldErrors(error: { issues: { path: (string | number)[]; message: string }[] }) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

function initialSharedFromEvent(event: EventDetails) {
  return {
    categoryId: "",
    title: event.title,
    description: event.description ?? "",
    type: event.type,
    visibility: event.visibility,
    status: event.status === "CANCELLED" ? "DRAFT" : event.status,
    capacity: String(event.capacity),
    pricePerPerson: event.pricePerPerson != null ? String(event.pricePerPerson) : "",
    privateCode: event.privateCode ?? ""
  };
}

export function EventForm({
  mode,
  categories,
  isPending,
  onSubmitCreateFree,
  onSubmitCreateArena,
  onSubmitUpdate
}: EventFormProps) {
  const isEdit = mode.kind === "edit";
  const isArena =
    mode.kind === "create-arena" || (isEdit && mode.event.sourceType === "ARENA_RESERVATION");
  const allowLocationFields = !isArena && isEdit;

  const initial = useMemo(() => {
    if (mode.kind === "edit") {
      const shared = initialSharedFromEvent(mode.event);
      return {
        shared,
        location: {
          startAtLocal: isoToDateTimeLocal(mode.event.startAt),
          endAtLocal: isoToDateTimeLocal(mode.event.endAt),
          addressName: mode.event.addressName,
          street: "",
          number: "",
          district: "",
          city: mode.event.city,
          state: mode.event.state
        }
      };
    }
    return {
      shared: {
        categoryId: "",
        title: "",
        description: "",
        type: "FREE" as const,
        visibility: "PUBLIC" as const,
        status: "DRAFT" as const,
        capacity: "10",
        pricePerPerson: "",
        privateCode: ""
      },
      location: {
        startAtLocal: "",
        endAtLocal: "",
        addressName: "",
        street: "",
        number: "",
        district: "",
        city: "",
        state: ""
      }
    };
  }, [mode]);

  const [shared, setShared] = useState(initial.shared);
  const [location, setLocation] = useState(initial.location);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function handleSharedChange(field: string, value: string) {
    setShared((prev) => ({ ...prev, [field]: value }));
    if (field === "type" && value === "FREE") {
      setShared((prev) => ({ ...prev, pricePerPerson: "" }));
    }
    if (field === "visibility" && value === "PUBLIC") {
      setShared((prev) => ({ ...prev, privateCode: "" }));
    }
  }

  function handleLocationChange(field: string, value: string) {
    setLocation((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    if (mode.kind === "create-free") {
      const parsed = freeLocationFormSchema.safeParse({ ...shared, ...location });
      if (!parsed.success) {
        setFieldErrors(zodFieldErrors(parsed.error));
        return;
      }
      onSubmitCreateFree(parseFreeLocationFormToPayload(parsed.data));
      return;
    }

    if (mode.kind === "create-arena") {
      const parsed = arenaReservationFormSchema.safeParse({
        ...shared,
        reservationId: mode.reservationId
      });
      if (!parsed.success) {
        setFieldErrors(zodFieldErrors(parsed.error));
        return;
      }
      onSubmitCreateArena(parseArenaReservationFormToPayload(parsed.data));
      return;
    }

    const parsed = updateEventFormSchema.safeParse({ ...shared, ...location });
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error));
      return;
    }
    const payload = parseUpdateFormToPayload(parsed.data, {
      allowLocationFields: mode.event.sourceType === "FREE_LOCATION"
    });
    if (Object.keys(payload).length === 0) {
      setFormError("Informe ao menos um campo para atualizar.");
      return;
    }
    onSubmitUpdate(payload);
  }

  const showPrice = shared.type === "PAID";
  const showPrivateCode = shared.visibility === "PRIVATE";
  const cancelled = isEdit && mode.event.status === "CANCELLED";

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {formError ? (
        <p className="text-destructive text-sm" role="alert">
          {formError}
        </p>
      ) : null}

      {mode.kind === "create-arena" ? (
        <ArenaReservationSummary slotLabel={mode.slotLabel} locationLabel={mode.locationLabel} />
      ) : null}

      {isEdit && mode.event.sourceType === "ARENA_RESERVATION" ? (
        <ArenaReservationSummary
          slotLabel={`${new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          }).format(new Date(mode.event.startAt))} – ${new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
          }).format(new Date(mode.event.endAt))}`}
          locationLabel={`${mode.event.addressName}, ${mode.event.city} – ${mode.event.state}`}
        />
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Informações do evento</h2>
        <EventFormFields
          categories={categories}
          values={shared}
          fieldErrors={fieldErrors}
          onChange={handleSharedChange}
          showPrivateCode={showPrivateCode}
          showPrice={showPrice}
        />
      </section>

      {!isArena && (mode.kind === "create-free" || allowLocationFields) ? (
        <section className="space-y-4">
          <FreeLocationFields
            values={location}
            fieldErrors={fieldErrors}
            onChange={handleLocationChange}
            readOnly={false}
          />
          {isEdit ? (
            <p className="text-muted-foreground text-xs">
              Rua, número e bairro não são retornados pelo detalhe do evento. Preencha apenas se
              precisar alterar o endereço completo.
            </p>
          ) : null}
        </section>
      ) : null}

      <Button
        type="submit"
        className="min-h-11 w-full sm:min-h-9 sm:w-auto"
        disabled={isPending || cancelled}
      >
        {isPending
          ? "Salvando…"
          : isEdit
            ? "Salvar alterações"
            : mode.kind === "create-arena"
              ? "Criar evento na reserva"
              : "Criar evento"}
      </Button>
    </form>
  );
}

export function mapMutationError(error: unknown): string {
  return getApiErrorMessage(error);
}
