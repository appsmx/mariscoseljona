import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    // Si getServerSession falla (ej. cookies corruptas en dominio de preview),
    // redirigir al login en lugar de tirar error 500
    console.error("Error obteniendo sesión:", e);
    redirect("/admin/login");
  }

  // Si no hay sesión, redirigir al login
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <AdminProviders>
      <div className="min-h-screen bg-muted/30">
        <AdminSidebar />
        <main className="lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-16 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    </AdminProviders>
  );
}
