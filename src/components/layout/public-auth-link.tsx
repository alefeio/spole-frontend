"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";

type PublicAuthLinkProps = {
  /** inline — barra desktop; stacked — drawer mobile */
  layout?: "inline" | "stacked";
};

export function PublicAuthLink({ layout = "inline" }: PublicAuthLinkProps) {
  const { data: user } = useMe();
  const stacked = layout === "stacked";

  if (user) {
    return (
      <Button
        variant={stacked ? "default" : "ghost"}
        size="sm"
        asChild
        className={cn(stacked && "min-h-11 w-full")}
      >
        <Link href="/dashboard">Minha área</Link>
      </Button>
    );
  }

  return (
    <div className={cn("flex gap-2", stacked && "w-full flex-col")}>
      <Button
        variant={stacked ? "outline" : "ghost"}
        size="sm"
        asChild
        className={cn(stacked && "min-h-11 w-full")}
      >
        <Link href="/login">Entrar</Link>
      </Button>
      <Button size="sm" asChild className={cn(stacked && "min-h-11 w-full")}>
        <Link href="/register">Criar conta</Link>
      </Button>
    </div>
  );
}
