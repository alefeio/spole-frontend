"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EventCategory } from "@/features/events/types";

type FieldErrors = Record<string, string>;

type EventFormFieldsProps = {
  categories: EventCategory[];
  values: {
    categoryId: string;
    title: string;
    description: string;
    type: "FREE" | "PAID";
    visibility: "PUBLIC" | "PRIVATE";
    status: "DRAFT" | "PUBLISHED";
    capacity: string;
    pricePerPerson: string;
    privateCode: string;
  };
  fieldErrors: FieldErrors;
  onChange: (field: string, value: string) => void;
  showPrivateCode: boolean;
  showPrice: boolean;
};

export function EventFormFields({
  categories,
  values,
  fieldErrors,
  onChange,
  showPrivateCode,
  showPrice
}: EventFormFieldsProps) {
  const activeCategories = categories.filter((c) => c.status !== "INACTIVE");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          className="min-h-11"
          value={values.title}
          onChange={(e) => onChange("title", e.target.value)}
          aria-invalid={Boolean(fieldErrors.title)}
        />
        {fieldErrors.title ? <p className="text-destructive text-sm">{fieldErrors.title}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <textarea
          id="description"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
          aria-invalid={Boolean(fieldErrors.description)}
        />
        {fieldErrors.description ? (
          <p className="text-destructive text-sm">{fieldErrors.description}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Categoria</Label>
        <select
          id="categoryId"
          className="border-input bg-background min-h-11 w-full rounded-md border px-3 text-sm"
          value={values.categoryId}
          onChange={(e) => onChange("categoryId", e.target.value)}
          aria-invalid={Boolean(fieldErrors.categoryId)}
        >
          <option value="">Selecione uma categoria</option>
          {activeCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {fieldErrors.categoryId ? (
          <p className="text-destructive text-sm">{fieldErrors.categoryId}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <select
            id="type"
            className="border-input bg-background min-h-11 w-full rounded-md border px-3 text-sm"
            value={values.type}
            onChange={(e) => onChange("type", e.target.value)}
          >
            <option value="FREE">Gratuito</option>
            <option value="PAID">Pago</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visibility">Visibilidade</Label>
          <select
            id="visibility"
            className="border-input bg-background min-h-11 w-full rounded-md border px-3 text-sm"
            value={values.visibility}
            onChange={(e) => onChange("visibility", e.target.value)}
          >
            <option value="PUBLIC">Público</option>
            <option value="PRIVATE">Privado</option>
          </select>
        </div>
      </div>

      {showPrice ? (
        <div className="space-y-2">
          <Label htmlFor="pricePerPerson">Preço por pessoa (R$)</Label>
          <Input
            id="pricePerPerson"
            type="text"
            inputMode="decimal"
            className="min-h-11"
            value={values.pricePerPerson}
            onChange={(e) => onChange("pricePerPerson", e.target.value)}
            aria-invalid={Boolean(fieldErrors.pricePerPerson)}
          />
          {fieldErrors.pricePerPerson ? (
            <p className="text-destructive text-sm">{fieldErrors.pricePerPerson}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="capacity">Capacidade</Label>
        <Input
          id="capacity"
          type="number"
          min={1}
          className="min-h-11"
          value={values.capacity}
          onChange={(e) => onChange("capacity", e.target.value)}
          aria-invalid={Boolean(fieldErrors.capacity)}
        />
        {fieldErrors.capacity ? (
          <p className="text-destructive text-sm">{fieldErrors.capacity}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Publicação</Label>
        <select
          id="status"
          className="border-input bg-background min-h-11 w-full rounded-md border px-3 text-sm"
          value={values.status}
          onChange={(e) => onChange("status", e.target.value)}
        >
          <option value="DRAFT">Salvar como rascunho</option>
          <option value="PUBLISHED">Publicar agora</option>
        </select>
        {fieldErrors.status ? (
          <p className="text-destructive text-sm">{fieldErrors.status}</p>
        ) : null}
      </div>

      {showPrivateCode ? (
        <div className="space-y-2">
          <Label htmlFor="privateCode">Código privado (opcional)</Label>
          <Input
            id="privateCode"
            className="min-h-11 font-mono"
            value={values.privateCode}
            onChange={(e) => onChange("privateCode", e.target.value)}
            placeholder="Deixe em branco para o sistema gerar"
            aria-invalid={Boolean(fieldErrors.privateCode)}
          />
          <p className="text-muted-foreground text-xs">
            Entre 8 e 128 caracteres. Se omitido, o backend gera automaticamente.
          </p>
          {fieldErrors.privateCode ? (
            <p className="text-destructive text-sm">{fieldErrors.privateCode}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

type FreeLocationFieldsProps = {
  values: {
    startAtLocal: string;
    endAtLocal: string;
    addressName: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
  };
  fieldErrors: FieldErrors;
  onChange: (field: string, value: string) => void;
  readOnly?: boolean;
};

export function FreeLocationFields({
  values,
  fieldErrors,
  onChange,
  readOnly
}: FreeLocationFieldsProps) {
  const disabled = readOnly;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Data e horário</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startAtLocal">Início</Label>
          <Input
            id="startAtLocal"
            type="datetime-local"
            className="min-h-11"
            value={values.startAtLocal}
            disabled={disabled}
            onChange={(e) => onChange("startAtLocal", e.target.value)}
            aria-invalid={Boolean(fieldErrors.startAtLocal)}
          />
          {fieldErrors.startAtLocal ? (
            <p className="text-destructive text-sm">{fieldErrors.startAtLocal}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endAtLocal">Término</Label>
          <Input
            id="endAtLocal"
            type="datetime-local"
            className="min-h-11"
            value={values.endAtLocal}
            disabled={disabled}
            onChange={(e) => onChange("endAtLocal", e.target.value)}
            aria-invalid={Boolean(fieldErrors.endAtLocal)}
          />
          {fieldErrors.endAtLocal ? (
            <p className="text-destructive text-sm">{fieldErrors.endAtLocal}</p>
          ) : null}
        </div>
      </div>

      <h3 className="text-base font-semibold">Local</h3>
      <div className="space-y-2">
        <Label htmlFor="addressName">Nome do local</Label>
        <Input
          id="addressName"
          className="min-h-11"
          value={values.addressName}
          disabled={disabled}
          onChange={(e) => onChange("addressName", e.target.value)}
          aria-invalid={Boolean(fieldErrors.addressName)}
        />
        {fieldErrors.addressName ? (
          <p className="text-destructive text-sm">{fieldErrors.addressName}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            className="min-h-11"
            value={values.street}
            disabled={disabled}
            onChange={(e) => onChange("street", e.target.value)}
            aria-invalid={Boolean(fieldErrors.street)}
          />
          {fieldErrors.street ? (
            <p className="text-destructive text-sm">{fieldErrors.street}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            className="min-h-11"
            value={values.number}
            disabled={disabled}
            onChange={(e) => onChange("number", e.target.value)}
            aria-invalid={Boolean(fieldErrors.number)}
          />
          {fieldErrors.number ? (
            <p className="text-destructive text-sm">{fieldErrors.number}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">Bairro</Label>
          <Input
            id="district"
            className="min-h-11"
            value={values.district}
            disabled={disabled}
            onChange={(e) => onChange("district", e.target.value)}
            aria-invalid={Boolean(fieldErrors.district)}
          />
          {fieldErrors.district ? (
            <p className="text-destructive text-sm">{fieldErrors.district}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            className="min-h-11"
            value={values.city}
            disabled={disabled}
            onChange={(e) => onChange("city", e.target.value)}
            aria-invalid={Boolean(fieldErrors.city)}
          />
          {fieldErrors.city ? <p className="text-destructive text-sm">{fieldErrors.city}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">UF</Label>
          <Input
            id="state"
            className="min-h-11 uppercase"
            maxLength={2}
            value={values.state}
            disabled={disabled}
            onChange={(e) => onChange("state", e.target.value.toUpperCase())}
            aria-invalid={Boolean(fieldErrors.state)}
          />
          {fieldErrors.state ? (
            <p className="text-destructive text-sm">{fieldErrors.state}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type ArenaReservationSummaryProps = {
  slotLabel: string;
  locationLabel: string;
};

export function ArenaReservationSummary({
  slotLabel,
  locationLabel
}: ArenaReservationSummaryProps) {
  return (
    <section className="bg-muted/30 space-y-3 rounded-xl border p-4">
      <h3 className="text-base font-semibold">Reserva confirmada</h3>
      <dl className="grid gap-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Horário</dt>
          <dd className="font-medium">{slotLabel}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Local</dt>
          <dd className="font-medium">{locationLabel}</dd>
        </div>
      </dl>
      <p className="text-muted-foreground text-xs">
        Data, horário e endereço são definidos pela reserva e não podem ser alterados aqui.
      </p>
    </section>
  );
}
