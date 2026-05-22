import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type PaymentDetailErrorProps = {
  error: unknown;
  onRetry?: () => void;
};

export function PaymentDetailError({ error, onRetry }: PaymentDetailErrorProps) {
  const is404 = error instanceof ApiError && error.status === 404;
  const is403 = error instanceof ApiError && error.status === 403;

  return (
    <div className="border-destructive/30 bg-destructive/5 mx-auto max-w-xl space-y-4 rounded-xl border p-8 text-center">
      <h1 className="text-destructive text-xl font-bold tracking-tight sm:text-2xl">
        {is404
          ? "Pagamento não encontrado"
          : is403
            ? "Acesso negado"
            : "Não foi possível carregar o pagamento"}
      </h1>
      <p className="text-muted-foreground text-sm">{getApiErrorMessage(error)}</p>
      <div className="flex flex-col justify-center gap-2 sm:flex-row">
        {onRetry ? (
          <Button type="button" className="min-h-11 sm:min-h-9" onClick={onRetry}>
            Tentar novamente
          </Button>
        ) : null}
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href="/account/payments">Voltar para meus pagamentos</Link>
        </Button>
      </div>
    </div>
  );
}
