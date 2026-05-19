import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { LoadingState } from "@/components/feedback/loading-state";

export const metadata = {
  title: "Entrar"
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando…" />}>
      <LoginForm />
    </Suspense>
  );
}
