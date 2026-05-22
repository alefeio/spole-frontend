"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventForm, mapMutationError } from "@/features/events/components/event-form";
import { useCreateEvent, useEventCategories } from "@/features/events/hooks";
import { buildOrganizerEventPath } from "@/features/events/event-links";

export default function NewOrganizerEventPage() {
  const router = useRouter();
  const categoriesQuery = useEventCategories();
  const createMutation = useCreateEvent();
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="space-y-6 overflow-x-hidden">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Novo evento</h1>
        <p className="text-muted-foreground text-sm">
          Local livre — você define data, horário e endereço.
        </p>
      </header>

      {categoriesQuery.isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando categorias…</p>
      ) : null}

      {categoriesQuery.isError ? (
        <p className="text-destructive text-sm" role="alert">
          {mapMutationError(categoriesQuery.error)}
        </p>
      ) : null}

      {formError ? (
        <p className="text-destructive text-sm" role="alert">
          {formError}
        </p>
      ) : null}

      {categoriesQuery.isSuccess ? (
        <EventForm
          mode={{ kind: "create-free" }}
          categories={categoriesQuery.data}
          isPending={createMutation.isPending}
          onSubmitCreateFree={(payload) => {
            setFormError(null);
            createMutation.mutate(payload, {
              onSuccess: (data) => {
                router.replace(buildOrganizerEventPath(data.id));
              },
              onError: (error) => setFormError(mapMutationError(error))
            });
          }}
          onSubmitCreateArena={() => {}}
          onSubmitUpdate={() => {}}
        />
      ) : null}

      <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
        <Link href="/account/events">← Meus eventos</Link>
      </Button>
    </div>
  );
}
