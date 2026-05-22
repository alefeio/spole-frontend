"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function LogoutButton({ variant = "outline", size = "sm", className }: LogoutButtonProps) {
  const logout = useLogout();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("min-h-9", className)}
      onClick={logout}
    >
      Sair
    </Button>
  );
}
