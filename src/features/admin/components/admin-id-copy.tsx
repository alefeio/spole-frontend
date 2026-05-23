"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type AdminIdCopyProps = {
  label: string;
  value: string;
};

export function AdminIdCopy({ label, value }: AdminIdCopyProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <p className="font-mono text-xs break-all">{value}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-9 shrink-0"
          onClick={() => void handleCopy()}
        >
          {copied ? "Copiado" : "Copiar"}
        </Button>
      </div>
    </div>
  );
}
