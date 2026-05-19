"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks";

type LogoutButtonProps = {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

export function LogoutButton({ variant = "outline", size = "sm" }: LogoutButtonProps) {
  const logout = useLogout();

  return (
    <Button type="button" variant={variant} size={size} className="min-h-9" onClick={logout}>
      Sair
    </Button>
  );
}
