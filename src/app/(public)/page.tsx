import Link from "next/link";
import { Building2, CalendarCheck, ClipboardList, Search, Share2, Users } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";

const howItWorks = [
  {
    step: "1",
    title: "Encontre ou crie uma atividade",
    description:
      "Navegue pelo catálogo de eventos ou publique o seu — público, privado, gratuito ou pago."
  },
  {
    step: "2",
    title: "Garanta sua vaga ou reserve um horário",
    description:
      "Inscreva-se, reserve vaga com prazo para pagamento ou escolha um slot em arena quando disponível."
  },
  {
    step: "3",
    title: "Acompanhe tudo pela sua conta",
    description:
      "Inscrições, bookings, reservas de quadra e pagamentos ficam centralizados no seu painel."
  }
] as const;

const profiles = [
  {
    icon: Users,
    title: "Participante",
    description: "Descubra eventos, entre em turmas e acompanhe suas inscrições em um só lugar.",
    cta: { label: "Ver eventos", href: "/events" }
  },
  {
    icon: Share2,
    title: "Organizador",
    description:
      "Crie eventos públicos ou privados, gratuitos ou pagos, e compartilhe o link com sua turma.",
    cta: { label: "Criar evento", href: "/account/events/new" }
  },
  {
    icon: Building2,
    title: "Dono de arena",
    description:
      "Organize espaços, horários disponíveis, reservas recebidas e agenda diária em um painel próprio para donos de arena.",
    cta: null
  }
] as const;

const highlights = [
  {
    icon: Search,
    title: "Eventos sem confusão",
    description:
      "Catálogo, detalhe e inscrição no mesmo fluxo — com suporte a eventos privados por link ou código."
  },
  {
    icon: CalendarCheck,
    title: "Vagas e pagamentos organizados",
    description:
      "Reserva temporária, checkout e acompanhamento de pagamento para atividades pagas, sem planilha paralela."
  },
  {
    icon: ClipboardList,
    title: "Arenas com agenda mais clara",
    description:
      "Horários disponíveis, reservas recebidas e visão do dia para quem gerencia a operação da quadra."
  }
] as const;

export default function HomePage() {
  return (
    <div className="space-y-14 overflow-x-hidden pb-6">
      <section className="brand-surface relative overflow-hidden rounded-2xl border px-4 py-10 text-center sm:px-8 sm:py-14">
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5">
          <BrandLogo href="/" size="large" priority />
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Eventos, vagas e quadras no mesmo lugar
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            Sua próxima partida começa aqui
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base text-pretty sm:text-lg">
            Encontre eventos esportivos, crie partidas com vagas organizadas e conecte arenas a
            pessoas que querem jogar.
          </p>
          <div className="grid w-full max-w-lg gap-3 sm:mx-auto sm:flex sm:max-w-none sm:flex-wrap sm:justify-center">
            <Button asChild size="lg" className="min-h-11 w-full sm:w-auto">
              <Link href="/events">Ver eventos</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-11 w-full sm:w-auto">
              <Link href="/account/events/new">Criar evento</Link>
            </Button>
          </div>
          <Button asChild variant="link" className="min-h-11 text-sm">
            <Link href="/arenas">Explorar arenas</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-6" aria-labelledby="how-it-works-heading">
        <header className="space-y-2 text-center sm:text-left">
          <h2 id="how-it-works-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
            Como funciona
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:mx-0 sm:text-base">
            Do convite à quadra reservada — três passos para participar ou organizar com mais
            clareza.
          </p>
        </header>
        <ol className="grid gap-4 sm:grid-cols-3">
          {howItWorks.map((item) => (
            <li
              key={item.step}
              className="bg-card flex flex-col gap-3 rounded-xl border p-5 shadow-xs"
            >
              <span
                className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                aria-hidden
              >
                {item.step}
              </span>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-6" aria-labelledby="profiles-heading">
        <header className="space-y-2 text-center sm:text-left">
          <h2 id="profiles-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
            Para cada perfil
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:mx-0 sm:text-base">
            Participantes, organizadores e donos de arena usam o Spolê em fluxos distintos — todos
            no mesmo ecossistema.
          </p>
        </header>
        <ul className="grid gap-4 md:grid-cols-3">
          {profiles.map((profile) => {
            const Icon = profile.icon;
            return (
              <li
                key={profile.title}
                className="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-accent text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-semibold">{profile.title}</h3>
                </div>
                <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                  {profile.description}
                </p>
                {profile.cta ? (
                  <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                    <Link href={profile.cta.href}>{profile.cta.label}</Link>
                  </Button>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Painel em <span className="font-medium">/owner</span> para contas com perfil de
                    dono de arena (acesso após login pela plataforma).
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-6" aria-labelledby="highlights-heading">
        <header className="space-y-2 text-center sm:text-left">
          <h2 id="highlights-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
            Por que usar o Spolê
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            O MVP web já cobre descoberta, organização e operação diária — sem prometer o que ainda
            não está no produto.
          </p>
        </header>
        <ul className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="bg-card flex flex-col gap-3 rounded-xl border p-5 shadow-xs"
              >
                <Icon className="text-primary size-5 shrink-0" aria-hidden />
                <h3 className="text-primary font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button asChild className="min-h-11 w-full sm:w-auto">
            <Link href="/events">Ver eventos</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
