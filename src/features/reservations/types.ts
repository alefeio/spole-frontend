export type ReservationType = "SINGLE" | "RECURRING" | string;

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "CONSUMED" | string;

export type ReservationSlotWindow = {
  startAt: string;
  endAt: string;
};

export type ReservationListItem = {
  id: string;
  slotId: string;
  organizerId: string;
  type: ReservationType;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  slot?: ReservationSlotWindow;
};

export type ReservationFinancial = {
  totalPrice: number;
  requiredPaymentAmount: number;
  paidAmount: number;
  expiresAt: string | null;
  confirmedAt: string | null;
};

export type ReservationRecurrence = {
  id: string;
  frequency: string;
  dayOfWeek: number;
  active: boolean;
};

export type ReservationNextOccurrence = {
  id: string;
  status: string;
  dueAt: string;
  slot: ReservationSlotWindow;
};

export type ReservationDetail = ReservationListItem & {
  financial?: ReservationFinancial;
  recurrence?: ReservationRecurrence | null;
  nextOccurrence?: ReservationNextOccurrence | null;
};

export type CreateReservationPayload = {
  slotId: string;
  type: "SINGLE";
};

export type CreateReservationResponse = {
  id: string;
  slotId: string;
  organizerId: string;
  type: ReservationType;
  status: ReservationStatus;
};

export type CancelReservationResponse = {
  id: string;
  status: "CANCELLED";
};
