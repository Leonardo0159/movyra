import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Link from "next/link";
import { Film, LayoutDashboard, ChevronLeft } from "lucide-react";
import { MovyraLogo } from "@/components/movyra-logo";

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return false;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(accessToken, secret);
    return (payload as unknown as JWTPayload).role === "ADMIN";
  } catch {
    return false;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[oklch(0.08_0.005_45)]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
        <div className="flex h-16 items-center border-b border-zinc-800/50 px-6">
          <Link href="/admin/content" className="text-amber">
            <MovyraLogo variant="wordmark" size="lg" />
          </Link>
        </div>
        <nav className="flex-1 p-4" aria-label="Admin navigation">
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin/content"
                className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white"
              >
                <Film className="h-5 w-5" />
                Content
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t border-zinc-800/50 p-4">
          <Link
            href="/catalog"
            className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white"
          >
            <LayoutDashboard className="h-5 w-5" />
            View Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="border-b border-zinc-800/50 px-6 py-4">
          <Link href="/admin/content" className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-amber">
            <ChevronLeft className="h-4 w-4" />
            Admin
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
