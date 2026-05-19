"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EventSearchInputProps = {
  defaultValue?: string;
  onSearch: (value: string) => void;
};

export function EventSearchInput({ defaultValue = "", onSearch }: EventSearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value.trim());
      }}
    >
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar por nome ou descrição"
        aria-label="Buscar eventos"
      />
      <Button type="submit">Buscar</Button>
    </form>
  );
}
