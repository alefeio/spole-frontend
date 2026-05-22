import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage, isNotFoundError } from "@/lib/api/error-messages";

type ReservationDetailErrorProps = {
  error: unknown;
  onRetry: () => void;
};

export function ReservationDetailError({ error, onRetry }: ReservationDetailErrorProps) {
  const isNotFound = isNotFoundError(error);

  return (
    <div className="border-destructive/30 bg-destructive/5 mx-auto max-w-xl space-y-4 rounded-xl border p-8 text-center">
      <h2 className="text-destructive text-xl font-semibold">
        {isNotFound ? "Reserva não encontrada" : "Não foi possível carregar a reserva"}
      </h2>
      <p className="text-muted-foreground text-sm">
        {isNotFound
          ? "Verifique o link ou volte para a lista de reservas."
          : getApiErrorMessage(error)}
      </p>
      <div className="flex flex-col justify-center gap-2 sm:flex-row">
        {!isNotFound ? (
          <Button type="button" className="min-h-11 sm:min-h-9" onClick={onRetry}>
            Tentar novamente
          </Button>
        ) : null}
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href="/account/reservations">Minhas reservas</Link>
        </Button>
      </div>
    </div>
  );
}
