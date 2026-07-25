import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const ok = await isAdminAuthenticated();
  if (ok) redirect("/admin");

  return (
    <div className="surface-glow flex min-h-screen items-center px-5 py-16">
      <AdminLoginForm />
    </div>
  );
}
