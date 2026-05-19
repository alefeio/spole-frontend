import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthGuestGuard } from "@/features/auth/components/auth-guest-guard";

export default function AuthRouteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthLayout>
      <AuthGuestGuard>{children}</AuthGuestGuard>
    </AuthLayout>
  );
}
