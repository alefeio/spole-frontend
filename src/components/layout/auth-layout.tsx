import Link from "next/link";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 text-xl font-semibold tracking-tight">
        Spolê
      </Link>
      <div className="bg-card w-full max-w-md rounded-xl border p-6 shadow-sm">{children}</div>
    </div>
  );
}
