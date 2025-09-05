import AuthHeader from "@/components/auth/auth-header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen ">
      <AuthHeader />
      {children}
    </div>
  );
}
