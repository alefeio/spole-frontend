import { AppLayoutShell } from "@/components/layout/app-layout-shell";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return <AppLayoutShell>{children}</AppLayoutShell>;
}
