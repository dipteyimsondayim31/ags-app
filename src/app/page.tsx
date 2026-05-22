import { prisma } from "@/lib/prisma";
import { CandidateDashboard } from "@/components/CandidateDashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Query all categories from DB
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Query all cards from DB
  const cards = await prisma.card.findMany({
    select: {
      id: true,
      question: true,
      answer: true,
      categoryId: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-start">
      <CandidateDashboard categories={categories} cards={cards} />
    </main>
  );
}
