import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin - IA NEXUS",
  description: "Panel de administracion de IA NEXUS",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#09090f", color: "rgba(255, 255, 255, 0.95)" }}
    >
      <AdminSidebar userRole={null} />

      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader user={null} />

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto page-enter">{children}</div>
        </main>
      </div>
    </div>
  );
}
