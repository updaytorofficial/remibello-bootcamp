import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { listPosts } from "@/lib/posts";
import { listRegistrations } from "@/lib/registrations";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");

  const [posts, registrations] = await Promise.all([
    listPosts(),
    listRegistrations(),
  ]);

  return (
    <div className="surface-glow min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <AdminDashboard
          posts={posts}
          registrationCount={registrations.length}
        />
      </div>
    </div>
  );
}
