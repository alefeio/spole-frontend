import { z } from "zod";
import { dateTimeLocalToIsoOffset } from "@/features/events/datetime";
import type {
  CreateArenaReservationEventPayload,
  CreateFreeLocationEventPayload,
  UpdateEventPayload
} from "@/features/events/types";

const privateCodeField = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || (v.length >= 8 && v.length <= 128), {
    message: "Código privado deve ter entre 8 e 128 caracteres"
  });

function refinePriceAndPrivate(
  data: {
    type: "FREE" | "PAID";
    pricePerPerson?: string;
    visibility: "PUBLIC" | "PRIVATE";
    privateCode?: string;
  },
  ctx: z.RefinementCtx
) {
  const priceRaw = data.pricePerPerson?.trim();
  const price = priceRaw ? Number(priceRaw.replace(",", ".")) : null;

  if (data.type === "PAID") {
    if (price == null || Number.isNaN(price) || price <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["pricePerPerson"],
        message: "Informe um preço maior que zero para eventos pagos"
      });
    }
  } else if (price != null && !Number.isNaN(price) && price > 0) {
    ctx.addIssue({
      code: "custom",
      path: ["pricePerPerson"],
      message: "Eventos gratuitos não devem ter preço"
    });
  }

  if (data.visibility === "PUBLIC" && data.privateCode?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["privateCode"],
      message: "Eventos públicos não usam código privado"
    });
  }
}

const sharedEventFields = {
  categoryId: z.string().uuid("Selecione uma categoria válida"),
  title: z.string().trim().min(1, "Informe o título").max(300, "Título muito longo"),
  description: z.string().trim().max(8000, "Descrição muito longa").optional(),
  type: z.enum(["FREE", "PAID"]),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  capacity: z.coerce
    .number()
    .int("Capacidade deve ser um número inteiro")
    .positive("Capacidade deve ser maior que zero"),
  pricePerPerson: z.string().optional(),
  privateCode: privateCodeField
};

export const freeLocationFormSchema = z
  .object({
    ...sharedEventFields,
    startAtLocal: z.string().min(1, "Informe data e hora de início"),
    endAtLocal: z.string().min(1, "Informe data e hora de término"),
    addressName: z.string().trim().min(1, "Informe o nome do local").max(300),
    street: z.string().trim().min(1, "Informe a rua").max(300),
    number: z.string().trim().min(1, "Informe o número").max(80),
    district: z.string().trim().min(1, "Informe o bairro").max(200),
    city: z.string().trim().min(1, "Informe a cidade").max(200),
    state: z
      .string()
      .trim()
      .length(2, "UF deve ter 2 caracteres")
      .transform((v) => v.toUpperCase())
  })
  .superRefine((data, ctx) => {
    refinePriceAndPrivate(data, ctx);
    const start = new Date(data.startAtLocal);
    const end = new Date(data.endAtLocal);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && !(end > start)) {
      ctx.addIssue({
        code: "custom",
        path: ["endAtLocal"],
        message: "O término deve ser depois do início"
      });
    }
  });

export const arenaReservationFormSchema = z
  .object({
    ...sharedEventFields,
    reservationId: z.string().uuid("Reserva inválida")
  })
  .superRefine(refinePriceAndPrivate);

export const updateEventFormSchema = z
  .object({
    categoryId: z.string().uuid("Selecione uma categoria válida").optional(),
    title: z.string().trim().min(1, "Informe o título").max(300).optional(),
    description: z.string().trim().max(8000).optional(),
    type: z.enum(["FREE", "PAID"]).optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
    startAtLocal: z.string().optional(),
    endAtLocal: z.string().optional(),
    addressName: z.string().trim().min(1).max(300).optional(),
    street: z.string().trim().min(1).max(300).optional(),
    number: z.string().trim().min(1).max(80).optional(),
    district: z.string().trim().min(1).max(200).optional(),
    city: z.string().trim().min(1).max(200).optional(),
    state: z
      .string()
      .trim()
      .length(2, "UF deve ter 2 caracteres")
      .transform((v) => v.toUpperCase())
      .optional(),
    capacity: z.coerce.number().int().positive().optional(),
    pricePerPerson: z.string().optional(),
    privateCode: privateCodeField
  })
  .superRefine((data, ctx) => {
    if (data.type || data.pricePerPerson || data.visibility || data.privateCode) {
      refinePriceAndPrivate(
        {
          type: data.type ?? "FREE",
          pricePerPerson: data.pricePerPerson,
          visibility: data.visibility ?? "PUBLIC",
          privateCode: data.privateCode
        },
        ctx
      );
    }
    if (data.startAtLocal && data.endAtLocal) {
      const start = new Date(data.startAtLocal);
      const end = new Date(data.endAtLocal);
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && !(end > start)) {
        ctx.addIssue({
          code: "custom",
          path: ["endAtLocal"],
          message: "O término deve ser depois do início"
        });
      }
    }
  });

export type FreeLocationFormValues = z.infer<typeof freeLocationFormSchema>;
export type ArenaReservationFormValues = z.infer<typeof arenaReservationFormSchema>;
export type UpdateEventFormValues = z.infer<typeof updateEventFormSchema>;

function parsePriceForApi(
  type: "FREE" | "PAID",
  pricePerPerson?: string
): number | null | undefined {
  const raw = pricePerPerson?.trim();
  if (type === "FREE") return null;
  if (!raw) return undefined;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

export function parseFreeLocationFormToPayload(
  values: FreeLocationFormValues
): CreateFreeLocationEventPayload {
  const description = values.description?.trim();
  const privateCode = values.privateCode?.trim();
  const price = parsePriceForApi(values.type, values.pricePerPerson);

  return {
    categoryId: values.categoryId,
    title: values.title,
    ...(description ? { description } : {}),
    type: values.type,
    visibility: values.visibility,
    sourceType: "FREE_LOCATION",
    status: values.status,
    startAt: dateTimeLocalToIsoOffset(values.startAtLocal),
    endAt: dateTimeLocalToIsoOffset(values.endAtLocal),
    addressName: values.addressName,
    street: values.street,
    number: values.number,
    district: values.district,
    city: values.city,
    state: values.state,
    capacity: values.capacity,
    ...(values.type === "PAID" && price != null ? { pricePerPerson: price } : {}),
    ...(values.visibility === "PRIVATE" && privateCode ? { privateCode } : {})
  };
}

export function parseArenaReservationFormToPayload(
  values: ArenaReservationFormValues
): CreateArenaReservationEventPayload {
  const description = values.description?.trim();
  const privateCode = values.privateCode?.trim();
  const price = parsePriceForApi(values.type, values.pricePerPerson);

  return {
    categoryId: values.categoryId,
    reservationId: values.reservationId,
    title: values.title,
    ...(description ? { description } : {}),
    type: values.type,
    visibility: values.visibility,
    sourceType: "ARENA_RESERVATION",
    status: values.status,
    capacity: values.capacity,
    ...(values.type === "PAID" && price != null ? { pricePerPerson: price } : {}),
    ...(values.visibility === "PRIVATE" && privateCode ? { privateCode } : {})
  };
}

export function parseUpdateFormToPayload(
  values: UpdateEventFormValues,
  options: { allowLocationFields: boolean }
): UpdateEventPayload {
  const payload: UpdateEventPayload = {};
  const description = values.description?.trim();

  if (values.categoryId) payload.categoryId = values.categoryId;
  if (values.title) payload.title = values.title;
  if (description !== undefined) payload.description = description.length ? description : null;
  if (values.type) payload.type = values.type;
  if (values.visibility) payload.visibility = values.visibility;
  if (values.status) payload.status = values.status;
  if (values.capacity) payload.capacity = values.capacity;

  if (values.type || values.pricePerPerson !== undefined) {
    const type = values.type ?? "FREE";
    const price = parsePriceForApi(type, values.pricePerPerson);
    payload.pricePerPerson = type === "FREE" ? null : (price ?? null);
  }

  const privateCode = values.privateCode?.trim();
  if (values.visibility === "PRIVATE" && privateCode) {
    payload.privateCode = privateCode;
  }

  if (options.allowLocationFields) {
    if (values.startAtLocal) payload.startAt = dateTimeLocalToIsoOffset(values.startAtLocal);
    if (values.endAtLocal) payload.endAt = dateTimeLocalToIsoOffset(values.endAtLocal);
    if (values.addressName) payload.addressName = values.addressName;
    if (values.street) payload.street = values.street;
    if (values.number) payload.number = values.number;
    if (values.district) payload.district = values.district;
    if (values.city) payload.city = values.city;
    if (values.state) payload.state = values.state;
  }

  return payload;
}

/** @deprecated use freeLocationFormSchema — mantido para compatibilidade com nome do brief */
export const createFreeLocationEventSchema = freeLocationFormSchema;
export const createArenaReservationEventSchema = arenaReservationFormSchema;
export const updateEventSchema = updateEventFormSchema;
