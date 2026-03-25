"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";
import type { UserSession } from "@/lib/auth/session";
import type { AppRole } from "@/lib/auth/roles";

function isEditorRoute(pathname: string) {
  return pathname.startsWith("/admin/posts/new") || /^\/admin\/posts\/[^/]+\/edit(?:\/)?$/.test(pathname);
}

export function AdminChrome({
  children,
  user,
  role,
}: {
  children: ReactNode;
  user: UserSession | null;
  role: AppRole | null;
}) {
  const pathname = usePathname();
  const editorRoute = isEditorRoute(pathname);

  if (editorRoute) {
    return (
      <main className="min-h-screen overflow-auto bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_24%),linear-gradient(180deg,#f7f9fc_0%,#f3f6fb_100%)] px-4 py-4 md:px-6 md:py-6">
        {children}
      </main>
    );
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
