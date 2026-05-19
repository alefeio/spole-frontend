"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";

export function PublicAuthLink() {
  const { data: user } = useMe();

  if (user) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Entrar</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/register">Cadastrar</Link>
      </Button>
    </>
  );
}
