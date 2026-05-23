"use client";

import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { AdminErrorState } from "@/features/admin/components/admin-error-state";
import { AdminUserDetailView } from "@/features/admin-users/components/admin-user-detail-view";
import { useAdminUser } from "@/features/admin-users/hooks";
import { isNotFoundError } from "@/lib/api/error-messages";

type AdminUserDetailPageProps = {
  params: Promise<{ userId: string }>;
};

export default function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const { userId } = use(params);
  const query = useAdminUser(userId);

  if (query.isLoading) {
    return <p className="text-muted-foreground text-sm">Carregando usuário…</p>;
  }

  if (query.isError) {
    return (
      <div className="space-y-4">
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
        {isNotFoundError(query.error) ? (
          <Button asChild variant="ghost" className="min-h-11 px-0">
            <Link href="/admin/users">← Voltar para usuários</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  if (query.data) {
    return <AdminUserDetailView user={query.data} />;
  }

  return null;
}
