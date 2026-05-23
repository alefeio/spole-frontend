import { z } from "zod";
import { dateTimeLocalToIsoOffset } from "@/features/events/datetime";
import type { CreateArenaPayload, PatchArenaPayload } from "@/features/owner-arenas/types";

export const createArenaFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome").max(200),
  description: z.string().trim().max(8000).optional(),
  phone: z.string().trim().min(8, "Telefone inválido").max(40),
  email: z.string().trim().email("E-mail inválido").max(320),
  document: z.string().trim().min(1, "Informe o documento").max(32),
  zipCode: z.string().trim().min(1, "Informe o CEP").max(20),
  street: z.string().trim().min(1, "Informe a rua").max(300),
  number: z.string().trim().min(1, "Informe o número").max(80),
  district: z.string().trim().min(1, "Informe o bairro").max(200),
  city: z.string().trim().min(1, "Informe a cidade").max(200),
  state: z
    .string()
    .trim()
    .length(2, "UF com 2 letras")
    .transform((v) => v.toUpperCase()),
  allowRecurring: z.boolean(),
  minAdvanceHours: z.coerce
    .number()
    .int()
    .min(0)
    .max(24 * 365),
  minReservationPaymentPercent: z.coerce.number().int().min(0).max(100)
});

export type CreateArenaFormValues = z.infer<typeof createArenaFormSchema>;

export function createArenaFormToPayload(values: CreateArenaFormValues): CreateArenaPayload {
  return {
    name: values.name,
    description: values.description?.trim() || undefined,
    phone: values.phone,
    email: values.email,
    document: values.document,
    address: {
      zipCode: values.zipCode,
      street: values.street,
      number: values.number,
      district: values.district,
      city: values.city,
      state: values.state
    },
    policy: {
      allowRecurring: values.allowRecurring,
      minAdvanceHours: values.minAdvanceHours,
      minReservationPaymentPercent: values.minReservationPaymentPercent
    }
  };
}

export const patchArenaFormSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(8000).optional(),
    phone: z.string().trim().min(8).max(40).optional(),
    email: z.string().trim().email().max(320).optional(),
    document: z.string().trim().min(1).max(32).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    zipCode: z.string().trim().max(20).optional(),
    street: z.string().trim().max(300).optional(),
    number: z.string().trim().max(80).optional(),
    district: z.string().trim().max(200).optional(),
    city: z.string().trim().max(200).optional(),
    state: z.string().trim().length(2).optional(),
    allowRecurring: z.boolean().optional(),
    minAdvanceHours: z.coerce
      .number()
      .int()
      .min(0)
      .max(24 * 365)
      .optional(),
    minReservationPaymentPercent: z.coerce.number().int().min(0).max(100).optional()
  })
  .refine((o) => Object.values(o).some((v) => v !== undefined && v !== ""), {
    message: "Altere ao menos um campo"
  });

export type PatchArenaFormValues = z.infer<typeof patchArenaFormSchema>;

export function patchArenaFormToPayload(values: PatchArenaFormValues): PatchArenaPayload {
  const payload: PatchArenaPayload = {};
  if (values.name !== undefined) payload.name = values.name;
  if (values.description !== undefined) payload.description = values.description || null;
  if (values.phone !== undefined) payload.phone = values.phone;
  if (values.email !== undefined) payload.email = values.email;
  if (values.document !== undefined) payload.document = values.document;
  if (values.status !== undefined) payload.status = values.status;

  const address: PatchArenaPayload["address"] = {};
  if (values.zipCode !== undefined) address.zipCode = values.zipCode;
  if (values.street !== undefined) address.street = values.street;
  if (values.number !== undefined) address.number = values.number;
  if (values.district !== undefined) address.district = values.district;
  if (values.city !== undefined) address.city = values.city;
  if (values.state !== undefined) address.state = values.state.toUpperCase();
  if (Object.keys(address).length) payload.address = address;

  const policy: PatchArenaPayload["policy"] = {};
  if (values.allowRecurring !== undefined) policy.allowRecurring = values.allowRecurring;
  if (values.minAdvanceHours !== undefined) policy.minAdvanceHours = values.minAdvanceHours;
  if (values.minReservationPaymentPercent !== undefined) {
    policy.minReservationPaymentPercent = values.minReservationPaymentPercent;
  }
  if (Object.keys(policy).length) payload.policy = policy;

  return payload;
}

export const createSpaceFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome").max(200),
  type: z.string().trim().min(1, "Informe o tipo").max(80),
  description: z.string().trim().max(4000).optional(),
  capacitySuggestion: z
    .union([z.literal(""), z.coerce.number().int().positive()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional()
});

export type CreateSpaceFormValues = z.infer<typeof createSpaceFormSchema>;

export const createSlotFormSchema = z
  .object({
    startAtLocal: z.string().min(1, "Informe início"),
    endAtLocal: z.string().min(1, "Informe término"),
    price: z.coerce.number().nonnegative("Preço inválido"),
    allowsRecurring: z.boolean(),
    notes: z.string().trim().max(2000).optional()
  })
  .superRefine((data, ctx) => {
    const startAt = dateTimeLocalToIsoOffset(data.startAtLocal);
    const endAt = dateTimeLocalToIsoOffset(data.endAtLocal);
    if (!startAt || !endAt) {
      ctx.addIssue({ code: "custom", path: ["startAtLocal"], message: "Data/hora inválida" });
      return;
    }
    if (new Date(endAt) <= new Date(startAt)) {
      ctx.addIssue({
        code: "custom",
        path: ["endAtLocal"],
        message: "Término deve ser após o início"
      });
    }
  });

export type CreateSlotFormValues = z.infer<typeof createSlotFormSchema>;

export function createSlotFormToPayload(values: CreateSlotFormValues) {
  return {
    startAt: dateTimeLocalToIsoOffset(values.startAtLocal)!,
    endAt: dateTimeLocalToIsoOffset(values.endAtLocal)!,
    price: values.price,
    allowsRecurring: values.allowsRecurring,
    notes: values.notes?.trim() || undefined
  };
}
