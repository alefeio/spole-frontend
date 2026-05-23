import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { ArenaOwnerCreateForm } from "@/features/owner-arenas/components/arena-owner-create-form";

export default function OwnerArenaNewPage() {
  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Nova arena"
        description="Cadastro via POST /arenas. Após criar, você será redirecionado ao painel da arena."
      />
      <ArenaOwnerCreateForm />
      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href="/owner">← Painel da arena</Link>
      </Button>
    </div>
  );
}
