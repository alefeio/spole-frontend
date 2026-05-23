import { OwnerLayout } from "@/components/layout/owner-layout";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { OwnerGuard } from "@/features/auth/components/owner-guard";

export default function OwnerRouteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OwnerLayout>
      <AuthGuard>
        <OwnerGuard>{children}</OwnerGuard>
      </AuthGuard>
    </OwnerLayout>
  );
}
