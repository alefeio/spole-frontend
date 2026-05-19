import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EventNotFoundState() {
  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-xl border p-8 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Evento não encontrado</h1>
      <p className="text-muted-foreground text-sm">
        O evento solicitado não existe, foi removido ou não está disponível para visualização.
      </p>
      <Button asChild>
        <Link href="/events">Voltar ao catálogo</Link>
      </Button>
    </div>
  );
}
