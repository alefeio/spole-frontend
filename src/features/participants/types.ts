export type ParticipantStatus = "CONFIRMED" | string;

export type EventParticipant = {
  id: string;
  eventId: string;
  userId: string;
  status: ParticipantStatus;
  createdAt: string;
};
