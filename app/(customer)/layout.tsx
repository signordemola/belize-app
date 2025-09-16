import { CryptoTracker } from "@/components/crypto-tracker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f5f7fa] pt-24 md:pt-28">
      <CryptoTracker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </div>
    </main>
  );
}
