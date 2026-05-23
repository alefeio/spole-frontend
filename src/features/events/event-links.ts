import type { EventDetails, EventVisibility } from "@/features/events/types";

export function buildPublicEventPath(eventId: string): string {
  return `/events/${eventId}`;
}

/** Caminho interno para retorno após login (preserva privateCode na query quando informado). */
export function buildEventParticipantReturnPath(eventId: string, privateCode?: string): string {
  const path = buildPublicEventPath(eventId);
  const trimmed = privateCode?.trim();
  if (!trimmed) return path;
  return `${path}?privateCode=${encodeURIComponent(trimmed)}`;
}

export function buildLoginRedirectHref(returnPath: string): string {
  const safePath = returnPath.startsWith("/") ? returnPath : "/dashboard";
  return `/login?redirect=${encodeURIComponent(safePath)}`;
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
