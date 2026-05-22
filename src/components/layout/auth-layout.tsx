import { BrandLogo } from "@/components/brand/brand-logo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="brand-surface flex min-h-full flex-col items-center justify-center px-3 py-6 sm:px-4 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <BrandLogo href="/" size="large" priority />
      </div>
      <div className="bg-card w-full max-w-md rounded-xl border p-4 shadow-sm sm:p-6">
        {children}
      </div>
    </div>
  );
}
