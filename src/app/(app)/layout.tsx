import { AppLayout } from "@/components/layout/app-layout";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AppRouteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppLayout>
      <AuthGuard>{children}</AuthGuard>
    </AppLayout>
  );
}
