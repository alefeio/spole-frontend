import type { EventDetails, EventVisibility } from "@/features/events/types";

export function buildPublicEventPath(eventId: string): string {
  return `/events/${eventId}`;
}

export function buildParticipantEventUrl(
  eventId: string,
  visibility: EventVisibility,
  privateCode?: string
): string {
  if (typeof window === "undefined") {
    const path = buildPublicEventPath(eventId);
    if (visibility === "PRIVATE" && privateCode) {
      return `${path}?privateCode=${encodeURIComponent(privateCode)}`;
    }
    return path;
  }

  const url = new URL(buildPublicEventPath(eventId), window.location.origin);
  if (visibility === "PRIVATE" && privateCode) {
    url.searchParams.set("privateCode", privateCode);
  }
  return url.toString();
}

export function buildOrganizerEventPath(eventId: string): string {
  return `/account/events/${eventId}`;
}

export function canCopyPublicCatalogLink(
  event: Pick<EventDetails, "visibility" | "status">
): boolean {
  return event.visibility === "PUBLIC" && event.status === "PUBLISHED";
}
