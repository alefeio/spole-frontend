"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import {
  getPaymentPendingMessage,
  getPaymentStatusLabel,
  getPaymentTerminalMessage,
  isPendingPaymentStatus,
  isTerminalPaymentStatus
} from "@/features/payments/payment-status-labels";
import type { Payment } from "@/features/payments/types";

function formatDateTime(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function resolveQrImageSrc(pixQrCode: string | null | undefined): string | null {
  if (!pixQrCode?.trim()) return null;
  const trimmed = pixQrCode.trim();
  if (trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length > 64) {
    return `data:image/png;base64,${trimmed.replace(/\s/g, "")}`;
  }
  return null;
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fallback abaixo */
    }
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

type PixCheckoutPanelProps = {
  payment: Payment;
  isPolling?: boolean;
  showProviderReference?: boolean;
  /** Oculta título/badge duplicados quando o pai já exibe o status (ex.: detalhe do pagamento). */
  showHeader?: boolean;
};

export function PixCheckoutPanel({
  payment,
  isPolling,
  showProviderReference = false,
  showHeader = true
}: PixCheckoutPanelProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const checkout = payment.checkout;
  const pixCopy = checkout?.pixCopyPaste?.trim() || null;
  const qrSrc = resolveQrImageSrc(checkout?.pixQrCode);
  const contextExpiry = formatDateTime(payment.contextExpiresAt);
  const paymentExpiry = formatDateTime(checkout?.paymentExpiresAt);
  const terminalMessage = getPaymentTerminalMessage(payment.status);
  const pending = isPendingPaymentStatus(payment.status);
  const terminal = isTerminalPaymentStatus(payment.status);

  async function handleCopyPix() {
    if (!pixCopy) return;
    setCopyError(false);
    const ok = await copyToClipboard(pixCopy);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
      return;
    }
    setCopyError(true);
  }

  return (
    <section className="space-y-4 rounded-xl border p-4 sm:p-6">
      {showHeader ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold">Pagamento com Pix</h3>
          <PaymentStatusBadge status={payment.status} />
        </div>
      ) : null}

      {isPolling ? (
        <p className="text-muted-foreground text-sm" role="status">
          Atualizando status do pagamento…
        </p>
      ) : null}

      {pending ? (
        <p className="text-muted-foreground text-sm">{getPaymentPendingMessage()}</p>
      ) : null}

      {terminal && terminalMessage ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {terminalMessage}
        </p>
      ) : null}

      {!pending && !terminal ? (
        <p className="text-muted-foreground text-sm">
          Status: {getPaymentStatusLabel(payment.status)}
        </p>
      ) : null}

      {pending && (contextExpiry || paymentExpiry) ? (
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          {contextExpiry ? (
            <div>
              <dt className="text-muted-foreground">Prazo da reserva/vaga</dt>
              <dd className="font-medium">{contextExpiry}</dd>
            </div>
          ) : null}
          {paymentExpiry ? (
            <div>
              <dt className="text-muted-foreground">Vencimento do Pix</dt>
              <dd className="font-medium">{paymentExpiry}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {pending && pixCopy ? (
        <div className="space-y-3">
          <p className="text-sm font-medium">Código Pix (copia e cola)</p>
          <p className="bg-muted max-h-32 overflow-auto rounded-lg border p-3 font-mono text-xs break-all">
            {pixCopy}
          </p>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full sm:w-auto"
            onClick={() => void handleCopyPix()}
          >
            {copied ? "Código Pix copiado" : "Copiar código Pix"}
          </Button>
          {copyError ? (
            <p className="text-destructive text-sm">
              Não foi possível copiar automaticamente. Selecione o código acima e copie manualmente.
            </p>
          ) : null}
        </div>
      ) : null}

      {pending && qrSrc ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">QR Code Pix</p>
          {/* eslint-disable-next-line @next/next/no-img-element -- QR pode ser data URL do gateway */}
          <img
            src={qrSrc}
            alt="QR Code para pagamento Pix"
            className="mx-auto max-h-64 max-w-full rounded-lg border bg-white p-2"
          />
        </div>
      ) : null}

      {pending && !pixCopy && !qrSrc ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-3 text-sm">
          Os dados do Pix ainda não estão disponíveis. Aguarde alguns instantes ou atualize a
          página.
        </p>
      ) : null}

      {showProviderReference && payment.providerReference ? (
        <p className="text-muted-foreground text-xs">
          Referência: <span className="font-mono break-all">{payment.providerReference}</span>
        </p>
      ) : null}
    </section>
  );
}
