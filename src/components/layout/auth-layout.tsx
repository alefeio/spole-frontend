import Link from "next/link";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-3 py-6 sm:px-4 sm:py-12">
      <Link href="/" className="mb-6 text-xl font-semibold tracking-tight sm:mb-8">
        Spolê
      </Link>
      <div className="bg-card w-full max-w-md rounded-xl border p-4 shadow-sm sm:p-6">
        {children}
      </div>
    </div>
  );
}
