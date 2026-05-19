import Link from "next/link";
import { Button } from "@/components/ui/button";

type AccessDeniedProps = {
  title?: string;
  description?: string;
};

export function AccessDenied({
  title = "Acesso negado",
  description = "Você não tem permissão para acessar esta área."
}: AccessDeniedProps) {
  return (
    <div className="border-destructive/30 bg-destructive/5 mx-auto max-w-lg space-y-4 rounded-lg border p-8 text-center">
      <h2 className="text-destructive text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
      <Button asChild>
        <Link href="/dashboard">Voltar ao dashboard</Link>
      </Button>
    </div>
  );
}
