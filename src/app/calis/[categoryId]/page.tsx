import { prisma } from "@/lib/prisma";
import { StudySession } from "@/components/StudySession";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface StudyPageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { categoryId } = await params;

  // Query category details
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  // If category doesn't exist
  if (!category) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-center items-center p-6 border-x border-white/5">
        <div className="bg-[#12131a] border border-white/5 p-8 rounded-3xl text-center space-y-6 max-w-sm shadow-2xl">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-lg font-bold text-white">Kategori Bulunamadı</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Aradığınız ders kategorisi sistemde mevcut değil veya kaldırılmış.
          </p>
          <Link
            href="/"
            className="block w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-95 transition-transform"
          >
            Kontrol Paneline Dön
          </Link>
        </div>
      </div>
    );
  }

  // Query all cards under this category
  const cards = await prisma.card.findMany({
    where: {
      categoryId: category.id,
    },
    select: {
      id: true,
      question: true,
      answer: true,
      categoryId: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-start">
      <StudySession category={category} initialCards={cards} />
    </main>
  );
}
