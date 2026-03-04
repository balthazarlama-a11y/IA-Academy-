import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin - IA NEXUS",
  description: "Panel de administracion de IA NEXUS",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const role = user?.role ?? null;
  const hasAccess = role === "admin" || role === "master";

  if (!hasAccess) {
    redirect("/admin/denied");
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#09090f", color: "rgba(255, 255, 255, 0.95)" }}
    >
      <AdminSidebar userRole={role} />

      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader user={user} />

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto page-enter">{children}</div>
        </main>
      </div>
    </div>
  );
}
