import Link from "next/link";
import { PlaceholderMessage } from "@/components/feedback/placeholder-message";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-6 text-center sm:py-8">
        <p className="text-primary text-sm font-medium tracking-wide uppercase">
          Eventos esportivos e bem-estar
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Encontre e participe de experiências no Spolê
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
          Descubra eventos públicos, inscreva-se em atividades gratuitas ou reserve sua vaga em
          eventos pagos — com integração à API real do projeto.
        </p>
        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
          <Button asChild size="lg" className="min-h-11">
            <Link href="/events">Explorar eventos</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-11">
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      </section>

      <PlaceholderMessage
        title="Catálogo e participação"
        description="Explore eventos públicos e participe de eventos gratuitos usando os fluxos reais da API."
      />
    </div>
  );
}
