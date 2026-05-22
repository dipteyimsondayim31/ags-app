import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/AdminDashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  // Middleware already protects this route, but an extra safety check is good practice
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/admin/giris");
  }

  // Fetch categories with card counts
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { cards: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Fetch cards with their parent category name
  const cards = await prisma.card.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col">
      {/* Premium Header */}
      <header className="border-b border-white/5 bg-[#12131a]/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🎴</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AGS Yönetim Paneli
                <span className="text-[10px] font-semibold bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full border border-violet-500/20">
                  Admin
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Kategori ve Bilgi Kartı Yönetimi
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 hidden md:inline">
              Oturum: <strong className="text-zinc-200">{session.user?.email}</strong>
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/giris" });
              }}
            >
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all duration-200 cursor-pointer"
              >
                Çıkış Yap
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard categories={categories} cards={cards} />
      </main>
    </div>
  );
}
