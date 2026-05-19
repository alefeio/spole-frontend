import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Detalhe do evento"
};

export default function EventDetailPlaceholderPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-xl border p-8 text-center">
      <p className="text-primary text-sm font-medium tracking-wide uppercase">Próxima sprint</p>
      <h1 className="text-3xl font-bold tracking-tight">Detalhe do evento</h1>
      <p className="text-muted-foreground">
        Esta rota foi criada apenas como placeholder. A integração com{" "}
        <code className="bg-muted rounded px-1 py-0.5">GET /events/:id</code> será feita na próxima
        sprint.
      </p>
      <Button asChild>
        <Link href="/events">Voltar ao catálogo</Link>
      </Button>
    </div>
  );
}
