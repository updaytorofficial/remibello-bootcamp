import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { listRegistrations } from "@/lib/registrations";
import RegistrationsPanel from "@/components/admin/RegistrationsPanel";

export const dynamic = "force-dynamic";

export default async function AdminRegistrationsPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");

  const registrations = await listRegistrations();

  return (
    <div className="surface-glow min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <RegistrationsPanel registrations={registrations} />
      </div>
    </div>
  );
}
