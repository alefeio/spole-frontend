/**
 * Rotas reais documentadas em /web/docs/02-features/api-contract-map.md.
 * Não adicionar paths que não existam no backend.
 */

export const endpoints = {
  health: {
    check: "/health"
  },
  auth: {
    register: "/auth/register",
    login: "/auth/login"
  },
  users: {
    me: "/users/me",
    myParticipants: "/users/me/participants",
    myNotifications: "/users/me/notifications",
    myBookings: "/users/me/bookings",
    myPayments: "/users/me/payments"
  },
  categories: {
    list: "/categories",
    byId: (id: string) => `/categories/${id}` as const
  },
  events: {
    list: "/events",
    byId: (id: string) => `/events/${id}` as const,
    participants: (eventId: string) => `/events/${eventId}/participants` as const,
    joinFree: (eventId: string) => `/events/${eventId}/participants/free` as const,
    bookings: (eventId: string) => `/events/${eventId}/bookings` as const
  },
  bookings: {
    cancel: (id: string) => `/bookings/${id}/cancel` as const
  },
  payments: {
    byId: (id: string) => `/payments/${id}` as const,
    forBooking: (bookingId: string) => `/bookings/${bookingId}/payments` as const,
    webhook: "/payments/webhook",
    reservationWebhook: "/reservation-payments/webhook",
    forReservation: (reservationId: string) => `/reservations/${reservationId}/payments` as const,
    forOccurrence: (occurrenceId: string) =>
      `/reservation-occurrences/${occurrenceId}/payments` as const
  },
  reservations: {
    create: "/reservations",
    me: "/reservations/me",
    byId: (id: string) => `/reservations/${id}` as const,
    cancel: (id: string) => `/reservations/${id}/cancel` as const
  },
  arenas: {
    create: "/arenas",
    byId: (id: string) => `/arenas/${id}` as const,
    slots: (arenaId: string) => `/arenas/${arenaId}/slots` as const,
    spaces: (arenaId: string) => `/arenas/${arenaId}/spaces` as const,
    reservations: (arenaId: string) => `/arenas/${arenaId}/reservations` as const
  },
  spaces: {
    slots: (spaceId: string) => `/spaces/${spaceId}/slots` as const
  },
  notifications: {
    markRead: (id: string) => `/notifications/${id}/read` as const
  }
} as const;
