import { AdminLayout } from "@/components/layout/admin-layout";
import { AdminGuard } from "@/features/auth/components/admin-guard";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AdminRouteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminLayout>
      <AuthGuard>
        <AdminGuard>{children}</AdminGuard>
      </AuthGuard>
    </AdminLayout>
  );
}
