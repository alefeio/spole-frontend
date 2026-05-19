import Link from "next/link";
import { PlaceholderMessage } from "@/components/feedback/placeholder-message";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-8 text-center">
        <p className="text-primary text-sm font-medium tracking-wide uppercase">
          Eventos esportivos e bem-estar
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Encontre e participe de experiências no Spolê
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Descubra eventos públicos, inscreva-se em atividades gratuitas ou reserve sua vaga em
          eventos pagos — com integração à API real do projeto.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/events">Explorar eventos</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      </section>

      <PlaceholderMessage
        title="Foundation sprint"
        description="Bootstrap do frontend concluído. Próxima etapa: integrar listagem real via features/events e TanStack Query."
      />
    </div>
  );
}
