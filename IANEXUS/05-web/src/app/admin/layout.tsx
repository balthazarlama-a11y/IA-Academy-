import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin - IA NEXUS",
  description: "Panel de administración de IA NEXUS",
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
      style={{
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 28%), radial-gradient(circle at top right, rgba(139,92,246,0.08), transparent 24%), linear-gradient(180deg, #f7f9fc 0%, #f3f6fb 100%)",
        color: "rgba(15, 23, 42, 0.96)",
      }}
    >
      <AdminSidebar userRole={role} />

      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader user={user} />

        <main className="flex-1 overflow-auto px-5 py-5 md:px-8 md:py-8">
          <div className="mx-auto max-w-[1760px] page-enter">{children}</div>
        </main>
      </div>
    </div>
  );
}

