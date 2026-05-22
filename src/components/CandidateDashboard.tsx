"use client";

import { useState, useEffect } from "react";
import { CircularProgress } from "./CircularProgress";
import { BottomNav } from "./BottomNav";
import { ProgressManager, CandidateState } from "@/lib/state";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  _count?: {
    cards: number;
  };
}

interface Card {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
}

interface CandidateDashboardProps {
  categories: Category[];
  cards: Card[];
}

export function CandidateDashboard({ categories, cards }: CandidateDashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "stats">("home");
  const [isStudyDrawerOpen, setIsStudyDrawerOpen] = useState(false);
  
  // Local state synced with localStorage
  const [localState, setLocalState] = useState<CandidateState | null>(null);

  // Sync on mount
  useEffect(() => {
    ProgressManager.updateStreak();
    ProgressManager.pruneObsoleteCards(cards.map((c) => c.id));
    ProgressManager.resetDailySecondsIfNewDay();
    
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        setLocalState(ProgressManager.getState());
      }
    }, 0);
    
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [cards]);

  if (!localState) {
    // Loading skeleton representing Obsidian Dark
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-center items-center p-6 border-x border-white/5">
        <div className="animate-pulse flex flex-col items-center space-y-4 w-full">
          <div className="h-6 w-32 bg-white/5 rounded-lg"></div>
          <div className="h-40 w-full bg-[#12131a]/80 border border-white/5 rounded-3xl"></div>
          <div className="h-20 w-full bg-[#12131a]/80 border border-white/5 rounded-3xl"></div>
          <div className="h-40 w-full bg-[#12131a]/80 border border-white/5 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalCards = cards.length;
  const learnedCount = localState.learnedCardIds.length;
  const reviewCount = localState.reviewCardIds.length;
  const targetDailyCount = 100; // Mock daily target

  // Calculate XP requirements
  const currentXp = localState.xp;
  const nextLevelXp = localState.level * 100;
  const xpPercentage = Math.min((currentXp / nextLevelXp) * 100, 100);

  // Reset Progress
  const handleResetProgress = () => {
    if (confirm("Tüm ders çalışma ilerlemenizi, seviyenizi ve tecrübe puanlarınızı sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      localStorage.removeItem("ags_candidate_progress_state");
      setLocalState(ProgressManager.getState());
      alert("İlerlemeniz sıfırlandı.");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col relative pb-28 border-x border-white/5 shadow-2xl">
      {/* HEADER */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 z-30 bg-[#090a0f]/90 backdrop-blur-md">
        <button className="h-10 w-10 rounded-xl bg-[#12131a] border border-white/5 flex items-center justify-center text-lg active:scale-95 transition-transform">
          ☰
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black tracking-tight text-white flex items-center justify-center gap-1">
            2026 MEB AGS
          </h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">
            Odaklan. Hatırla. <span className="underline decoration-violet-500 decoration-2 font-bold text-violet-400">Başar.</span>
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full text-xs font-bold text-orange-400 shadow-sm shadow-orange-500/5">
          <span>🔥</span>
          <span>{localState.streak} Gün</span>
        </div>
      </header>

      {/* VIEW TABS */}
      {activeTab === "home" ? (
        // TAB 1: HOME VIEW
        <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-none">
          {/* LEVEL & XP PROGRESS BAR */}
          <div className="bg-[#12131a]/85 backdrop-blur-md border border-white/5 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-violet-300">Seviye {localState.level}</span>
              <span className="text-slate-400 font-semibold">{currentXp} / {nextLevelXp} XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-violet-950/40 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* BUGÜNKÜ HEDEFİN WIDGET */}
          <div className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-5 rounded-3xl flex items-center justify-between relative overflow-hidden shadow-xl">
            {/* Background glowing circle */}
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-violet-500/5 blur-2xl"></div>

            {/* Left Brain Content */}
            <div className="flex items-center space-x-4 z-10">
              <div className="relative h-16 w-16 flex items-center justify-center bg-violet-500/10 border border-violet-500/10 rounded-2xl text-3xl">
                🧠
                <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-violet-500 animate-ping"></div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-300 tracking-wide flex items-center gap-1">
                  Bugünkü Hedefin 🎯
                </h3>
                <p className="text-2xl font-black text-white tracking-wider">
                  25:00
                </p>
                <button
                  onClick={() => setIsStudyDrawerOpen(true)}
                  className="px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 shadow-md shadow-violet-500/10 transition-transform active:scale-95 cursor-pointer"
                >
                  Odaklan ▶
                </button>
              </div>
            </div>

            {/* Right Circular Progress Ring */}
            <div className="z-10 flex flex-col items-center justify-center space-y-1 cursor-pointer" onClick={() => setActiveTab("stats")}>
              <CircularProgress value={learnedCount} total={targetDailyCount} size={88} strokeWidth={6} />
              <span className="text-[10px] font-bold text-slate-400 mt-1">{learnedCount} / {targetDailyCount} kart</span>
            </div>
          </div>

          {/* KARTLARIM COUNTERS */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Kartlarım</h3>
              <button
                onClick={() => setActiveTab("stats")}
                className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-0.5"
              >
                Tümünü Gör <span>›</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Box 1: Total */}
              <div className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-xl mb-1">📇</span>
                <span className="text-lg font-black text-white">{totalCards}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">Toplam Kart</span>
              </div>
              {/* Box 2: Learned */}
              <div className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-xl mb-1">✅</span>
                <span className="text-lg font-black text-green-400">{learnedCount}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">Öğrenildi</span>
              </div>
              {/* Box 3: To Review */}
              <div className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-xl mb-1">🔄</span>
                <span className="text-lg font-black text-yellow-400">{reviewCount}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">Tekrar Edilecek</span>
              </div>
            </div>
          </div>

          {/* ÇALIŞMAYA DEVAM ET CATEGORY LIST */}
          <div className="space-y-3">
            <div className="flex items-center space-x-1.5 px-1">
              <span className="text-sm">⏱</span>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Çalışmaya Devam Et</h3>
            </div>

            <div className="space-y-3">
              {categories.map((category) => {
                const categoryCards = cards.filter((c) => c.categoryId === category.id);
                const totalInCat = categoryCards.length;
                const learnedInCat = categoryCards.filter((c) => localState.learnedCardIds.includes(c.id)).length;
                const catPercentage = totalInCat > 0 ? Math.round((learnedInCat / totalInCat) * 100) : 0;

                // Color mappings for category cards
                const colorClasses = [
                  "bg-violet-500/10 border-violet-500/20 text-violet-400",
                  "bg-blue-500/10 border-blue-500/20 text-blue-400",
                  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                  "bg-amber-500/10 border-amber-500/20 text-amber-400"
                ];
                const bgColors = [
                  "bg-violet-500",
                  "bg-blue-500",
                  "bg-emerald-500",
                  "bg-amber-500"
                ];
                // Select color based on category index
                const colorIndex = categories.indexOf(category) % colorClasses.length;

                return (
                  <Link
                    key={category.id}
                    href={`/calis/${category.id}`}
                    className="block bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-4 rounded-2xl hover:border-violet-500/30 transition-all duration-200 group active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 w-4/5">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl border ${colorClasses[colorIndex]}`}>
                          {category.icon || "📚"}
                        </div>
                        <div className="space-y-1.5 w-full">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-violet-300 transition-colors">
                            {category.name}
                          </h4>
                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className={`h-full ${bgColors[colorIndex]} rounded-full`}
                                style={{ width: `${catPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-[9px] font-semibold text-slate-400">
                              {learnedInCat} / {totalInCat} kart
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-slate-500 group-hover:text-white transition-colors text-lg font-light">
                        ›
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* MOTIVATION CARD */}
          <div className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border border-amber-500/10 p-5 rounded-3xl relative overflow-hidden flex items-center space-x-4 shadow-inner">
            <span className="text-4xl animate-bounce">⭐</span>
            <div className="space-y-1">
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                Küçük adımlar, <strong className="text-amber-400">büyük değişimler</strong> yaratır.
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">— Sen yapabilirsin! 💪</p>
            </div>
            {/* Sparkles */}
            <span className="absolute right-4 top-3 text-xs opacity-50">✨</span>
            <span className="absolute right-10 bottom-3 text-[10px] opacity-35">✦</span>
          </div>
        </div>
      ) : (
        // TAB 2: STATISTICS & HISTORY VIEW
        <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-none">
          {/* STATS HEADER */}
          <div className="text-center py-2">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">İlerleme İstatistikleri</h2>
            <p className="text-xs text-slate-500 mt-1">Öğrenme verileriniz ve başarımlarınız</p>
          </div>

          {/* OVERALL STUDY SCORECARD */}
          <div className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-5 rounded-3xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-slate-300">Öğrenme Oranı</span>
              <span className="text-xs font-black text-violet-400">
                %{totalCards > 0 ? Math.round((learnedCount / totalCards) * 100) : 0}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Kazanılan Seviye</span>
                <span className="text-xl font-extrabold text-white">Seviye {localState.level}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Kazanılan Toplam XP</span>
                <span className="text-xl font-extrabold text-white">{(localState.level - 1) * 100 + localState.xp} XP</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Çalışılan Gün Sayısı</span>
                <span className="text-xl font-extrabold text-white">🔥 {localState.streak} Gün</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Toplam Öğrenilen</span>
                <span className="text-xl font-extrabold text-green-400">{learnedCount} Kart</span>
              </div>
            </div>
          </div>

          {/* CATEGORIES PROGRESS DETAILS */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 px-1">Kategori Dağılımları</h3>
            <div className="space-y-3">
              {categories.map((category) => {
                const categoryCards = cards.filter((c) => c.categoryId === category.id);
                const totalInCat = categoryCards.length;
                const learnedInCat = categoryCards.filter((c) => localState.learnedCardIds.includes(c.id)).length;
                const catPercentage = totalInCat > 0 ? Math.round((learnedInCat / totalInCat) * 100) : 0;

                return (
                  <div key={category.id} className="bg-[#12131a]/60 border border-white/5 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{category.icon || "📚"}</span>
                        {category.name}
                      </span>
                      <span className="text-xs font-extrabold text-slate-400">%{catPercentage}</span>
                    </div>

                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${catPercentage}%` }}></div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                      <span>{learnedInCat} Öğrenildi</span>
                      <span>{totalInCat} Toplam Kart</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DANGER AREA (RESET) */}
          <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-3xl space-y-3">
            <h4 className="text-xs font-bold text-red-400">Verileri Yönet</h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Tüm yerel ders çalışma ilerlemeniz (seviyeniz, tecrübeniz ve öğrenme geçmişiniz) bu tarayıcıda saklanır. İsterseniz bunları sıfırlayabilirsiniz.
            </p>
            <button
              onClick={handleResetProgress}
              className="px-4 py-2 rounded-xl text-[10px] font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer"
            >
              İlerlemeyi Sıfırla
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStudyClick={() => setIsStudyDrawerOpen(true)}
      />

      {/* STUDY PICKER DRAWER / MODAL */}
      {isStudyDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setIsStudyDrawerOpen(false)}></div>
          
          {/* Drawer Content */}
          <div className="bg-[#12131a] border-t border-white/10 w-full max-w-md rounded-t-3xl p-6 z-10 space-y-6 max-h-[80vh] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">Çalışılacak Kategori</h3>
              <button
                onClick={() => setIsStudyDrawerOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg border border-white/5 cursor-pointer"
              >
                Kapat
              </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-3">
              {categories.map((category) => {
                const count = cards.filter((c) => c.categoryId === category.id).length;
                return (
                  <Link
                    key={category.id}
                    href={`/calis/${category.id}`}
                    onClick={() => setIsStudyDrawerOpen(false)}
                    className="flex items-center justify-between p-3.5 bg-[#090a0f] border border-white/5 hover:border-violet-500/30 rounded-2xl transition-all hover:translate-x-1 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon || "📚"}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{category.name}</h4>
                        <span className="text-[10px] text-slate-500 font-semibold">{count} kart mevcut</span>
                      </div>
                    </div>
                    <span className="text-violet-400 text-lg font-bold">▶</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
