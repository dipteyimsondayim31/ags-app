"use client";

import React from "react";

interface CardProps {
  question: string;
  answer: string;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  onDifficultySelect: (difficulty: "easy" | "hard", e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Card({
  question,
  answer,
  isFlipped,
  setIsFlipped,
  onDifficultySelect,
}: CardProps) {
  return (
    <div className="w-full max-w-sm h-[380px] perspective-1000 cursor-pointer">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-full duration-500 preserve-3d rounded-3xl transition-transform ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT SIDE (Question) */}
        <div className="absolute inset-0 w-full h-full bg-[#12131a] border border-white/5 rounded-3xl p-6 flex flex-col justify-between backface-hidden shadow-2xl overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-500/20">
              Soru ❓
            </span>
            <span className="text-[10px] font-medium text-slate-500">Çevirmek için dokunun</span>
          </div>

          <div className="flex-1 flex items-center justify-center py-4 px-2 z-10 text-center">
            <p className="text-lg font-bold text-zinc-100 leading-relaxed font-sans select-none">
              {question}
            </p>
          </div>

          <div className="flex justify-center z-10">
            <span className="text-xs font-bold text-violet-400/70 hover:text-violet-400 flex items-center gap-1.5 transition-colors">
              Cevabı Gör <span className="text-sm font-light">↺</span>
            </span>
          </div>
        </div>

        {/* BACK SIDE (Answer) */}
        <div className="absolute inset-0 w-full h-full bg-[#12131a] border border-white/5 rounded-3xl p-6 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-center border-b border-white/5 pb-2 z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Cevap 💡
            </span>
            <span className="text-[10px] font-medium text-slate-500">Soruya dönmek için dokunun</span>
          </div>

          <div className="flex-1 overflow-y-auto py-5 px-1 my-2 z-10 text-center flex items-center justify-center scrollbar-none">
            <p className="text-sm font-medium text-zinc-300 leading-relaxed select-none">
              {answer}
            </p>
          </div>

          {/* Difficulty Buttons */}
          <div className="grid grid-cols-2 gap-3 z-20 pt-2 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => onDifficultySelect("hard", e)}
              className="py-3 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5"
            >
              <span>Zor 🔄</span>
              <span className="text-[8px] opacity-80 text-amber-500/70 font-semibold">+5 XP / Tekrar Et</span>
            </button>

            <button
              onClick={(e) => onDifficultySelect("easy", e)}
              className="py-3 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5"
            >
              <span>Kolay ✅</span>
              <span className="text-[8px] opacity-80 text-emerald-500/70 font-semibold">+10 XP / Öğrenildi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
