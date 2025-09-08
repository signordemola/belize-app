import AdminNavbar from "@/components/admin/admin-navbar";

export default function ControlPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f5f7fa] pt-24 md:pt-28">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </div>
    </main>
  );
}
