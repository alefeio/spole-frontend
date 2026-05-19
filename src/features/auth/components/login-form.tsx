"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFormSchema } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";
import { getApiErrorMessage } from "@/lib/api/error-messages";

export function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
  const redirect = searchParams.get("redirect");
  const redirectTo = redirect?.startsWith("/") ? redirect : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loginMutation = useLogin(redirectTo);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const parsed = loginFormSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errors[key]) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    loginMutation.mutate(parsed.data, {
      onError: (error) => {
        setFieldErrors({ form: getApiErrorMessage(error) });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Entrar</h1>
        <p className="text-muted-foreground text-sm">Acesse sua conta no Spolê</p>
      </header>

      {registered ? (
        <p className="bg-primary/10 text-primary rounded-md px-3 py-2 text-center text-sm">
          Conta criada com sucesso. Faça login para continuar.
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {fieldErrors.form ? (
          <p className="text-destructive text-sm" role="alert">
            {fieldErrors.form}
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? (
            <p className="text-destructive text-sm">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          {fieldErrors.password ? (
            <p className="text-destructive text-sm">{fieldErrors.password}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="min-h-11 w-full sm:min-h-9"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Não tem conta?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
