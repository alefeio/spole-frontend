import { z } from "zod";

const passwordSchema = z
  .string()
  .min(1, "Informe a senha")
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Z]/, "A senha deve incluir uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve incluir uma letra minúscula")
  .regex(/[0-9]/, "A senha deve incluir um número");

export const loginFormSchema = z.object({
  email: z.string().trim().min(1, "Informe o e-mail").email("E-mail inválido").max(320),
  password: z.string().min(1, "Informe a senha")
});

export const registerFormSchema = z
  .object({
    name: z.string().trim().min(1, "Informe o nome").max(200),
    email: z.string().trim().min(1, "Informe o e-mail").email("E-mail inválido").max(320),
    password: passwordSchema,
    phone: z.string().trim().max(32).optional()
  })
  .superRefine((data, ctx) => {
    const phone = data.phone?.trim();
    if (phone && phone.length > 0 && phone.length < 8) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Telefone deve ter no mínimo 8 caracteres"
      });
    }
  });

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function parseRegisterPayload(values: RegisterFormValues) {
  const phone = values.phone?.trim();
  return {
    name: values.name,
    email: values.email,
    password: values.password,
    ...(phone && phone.length >= 8 ? { phone } : {})
  };
}
