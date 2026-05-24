"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ArenasDirectOpen() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    router.push(`/arenas/${encodeURIComponent(trimmed)}`);
  }

  return (
    <details className="rounded-xl border p-4">
      <summary className="cursor-pointer text-sm font-medium">
        Tenho um link ou código de arena
      </summary>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <p className="text-muted-foreground text-sm">
          Cole o identificador que você recebeu no convite ou no link compartilhado.
        </p>
        <div className="space-y-2">
          <Label htmlFor="arena-direct-code">Código da arena</Label>
          <Input
            id="arena-direct-code"
            name="arenaCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código recebido no link"
            className="min-h-11 text-sm break-all"
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          className="min-h-11 w-full sm:w-auto"
          disabled={!code.trim()}
        >
          Abrir arena
        </Button>
        <p className="text-muted-foreground text-xs">
          Prefere navegar? Use a{" "}
          <Link href="/arenas" className="text-primary font-medium hover:underline">
            busca de arenas
          </Link>{" "}
          acima.
        </p>
      </form>
    </details>
  );
}
