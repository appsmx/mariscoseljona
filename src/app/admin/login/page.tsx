import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminProviders } from "@/components/admin/AdminProviders";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    // Si la cookie de sesión está corrupta (JWEDecryptionFailed),
    // ignorar y mostrar el login normalmente
    console.error("Error obteniendo sesión en login:", e);
  }

  if (session?.user) redirect("/admin");

  return (
    <AdminProviders>
      <div className="min-h-screen flex items-center justify-center bg-ocean-950 px-4 py-12 relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-ocean-500/20 blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-amber-brand-500/15 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="rounded-3xl bg-card border border-border shadow-2xl p-8">
            {/* Logo */}
            <div className="flex flex-col items-center text-center mb-8">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-500 to-ocean-700 shadow-lg ring-1 ring-white/20 mb-4">
                <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
                  <path
                    d="M14 36c0-7 6-13 13-13 4 0 8 2 10 5 1-4 5-7 9-7 1 0 2 0 3 1-3 1-5 4-5 7 0 0 4-2 7-1-2 4-6 6-10 6-2 0-3 0-4-1-1 4-5 7-9 7-7 0-14-1-14-4z"
                    fill="#fef3c7"
                  />
                  <circle cx="22" cy="32" r="1.6" fill="#0d9488" />
                </svg>
              </span>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Mariscos El Jona
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.18em] mt-1">
                Panel Administrativo
              </p>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Acceso restringido al personal autorizado.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-white/40">
            © {new Date().getFullYear()} Mariscos El Jona · Sistema Logan
          </p>
        </div>
      </div>
    </AdminProviders>
  );
}
