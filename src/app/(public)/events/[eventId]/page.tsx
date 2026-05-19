import { EventDetails } from "@/features/events/components/event-details";

export const metadata = {
  title: "Detalhe do evento"
};

type EventDetailPageProps = {
  params: Promise<{
    eventId: string;
  }>;
  searchParams: Promise<{
    privateCode?: string;
  }>;
};

export default async function EventDetailPage({ params, searchParams }: EventDetailPageProps) {
  const { eventId } = await params;
  const { privateCode } = await searchParams;

  return <EventDetails eventId={eventId} privateCode={privateCode} />;
}
