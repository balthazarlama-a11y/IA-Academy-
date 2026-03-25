import { redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin/admin-chrome";
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
    <AdminChrome user={user} role={role}>
      {children}
    </AdminChrome>
  );
}
