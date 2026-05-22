import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Encontre sua turma",
    description:
      "Peladas, aulas, torneios e treinos abertos — veja quem vai, reserve vaga e chegue para jogar, não para adivinhar se ainda tem lugar."
  },
  {
    title: "Mova o corpo com regularidade",
    description:
      "Futebol, vôlei, corrida, funcional e muito mais. Filtre por cidade e data e encaixe o esporte na sua rotina de verdade."
  },
  {
    title: "Quadra reservada, sem stress",
    description:
      "Precisa de horário em arena? Reserve o espaço, pague quando necessário e concentre-se no jogo — a organização fica com o Spolê."
  }
] as const;

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="brand-surface relative overflow-hidden rounded-2xl border px-4 py-10 text-center sm:px-8 sm:py-14">
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5">
          <BrandLogo href="/" size="large" priority />
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Esporte, convivência e quadra na palma da mão
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            Sua próxima partida começa aqui
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base text-pretty sm:text-lg">
            Inscreva-se em eventos perto de você, garanta vaga em atividades pagas e reserve
            horários em arenas. Menos mensagem solta no grupo, mais gente na quadra e na linha de
            chegada.
          </p>
          <div className="grid w-full max-w-md gap-3 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center">
            <Button asChild size="lg" className="min-h-11 w-full sm:w-auto">
              <Link href="/events">Ver eventos agora</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-11 w-full sm:w-auto">
              <Link href="/register">Criar conta grátis</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <header className="space-y-2 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Feito para quem quer jogar, não só assistir
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            O Spolê junta descoberta de eventos, inscrição e reserva de espaço em um fluxo simples —
            para você aparecer, conhecer gente e manter o ritmo.
          </p>
        </header>
        <ul className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <li
              key={item.title}
              className="bg-card flex flex-col gap-2 rounded-xl border p-5 shadow-xs"
            >
              <h3 className="text-primary font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ul>
        <div className="flex justify-center sm:justify-start">
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/events">Encontrar um evento</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
