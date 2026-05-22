"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card } from "./Card";
import { Particles, ParticlesRef } from "./Particles";
import { ProgressManager } from "@/lib/state";

interface CardType {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
}

interface CategoryType {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

interface StudySessionProps {
  category: CategoryType;
  initialCards: CardType[];
}

export function StudySession({ category, initialCards }: StudySessionProps) {
  const [sessionCards, setSessionCards] = useState<CardType[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studySeconds, setStudySeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Level Up Modal State
  const [levelUpInfo, setLevelUpInfo] = useState<{ show: boolean; level: number } | null>(null);

  // Particles component reference
  const particlesRef = useRef<ParticlesRef | null>(null);

  // Track study seconds
  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setStudySeconds((prev) => prev + 1);
      ProgressManager.addStudySeconds(1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  // If no cards exist in this category
  if (initialCards.length === 0) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-center items-center p-6 border-x border-white/5 relative">
        <div className="bg-[#12131a] border border-white/5 p-8 rounded-3xl text-center space-y-6 max-w-sm shadow-2xl">
          <span className="text-5xl">📭</span>
          <h2 className="text-lg font-bold text-white">Bu Kategoride Kart Bulunmuyor</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Yönetici panelinden bu kategoriye yeni bilgi kartları ekleyebilirsiniz.
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

  const currentCard = sessionCards[currentIndex];
  // Progress is measured by how many cards we've completely finished relative to initial cards
  const progressPercentage = Math.min(
    (currentIndex / initialCards.length) * 100,
    100
  );

  // Format study seconds to MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDifficultySelect = (difficulty: "easy" | "hard", e: React.MouseEvent<HTMLButtonElement>) => {
    if (!currentCard) return;

    // Trigger feedback particle burst
    if (particlesRef.current) {
      particlesRef.current.triggerBurst(e.clientX, e.clientY);
    }

    let result;
    if (difficulty === "easy") {
      result = ProgressManager.markCardAsLearned(currentCard.id);
    } else {
      result = ProgressManager.markCardForReview(currentCard.id);
      
      // If "Zor" (Hard) is selected, push it to the end of the session cards to review it again in this deck
      setSessionCards((prev) => [...prev, currentCard]);
    }

    // Check level up
    if (result && result.leveledUp) {
      setLevelUpInfo({ show: true, level: result.newLevel });
    }

    // Delay flipping the card back and transitioning to the next card to allow animations
    setTimeout(() => {
      setIsFlipped(false);
      
      if (currentIndex + 1 >= sessionCards.length) {
        setIsFinished(true);
        if (particlesRef.current) {
          particlesRef.current.triggerConfetti();
          // Trigger double confetti for better dopamin effect
          setTimeout(() => particlesRef.current?.triggerConfetti(), 400);
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 250);
  };

  const handleRestart = () => {
    setSessionCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setStudySeconds(0);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col relative pb-8 border-x border-white/5 shadow-2xl">
      {/* Canvas Effects */}
      <Particles ref={particlesRef} />

      {/* HEADER */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 z-30 bg-[#090a0f]/90 backdrop-blur-md border-b border-white/5">
        <Link
          href="/"
          className="h-10 w-10 rounded-xl bg-[#12131a] border border-white/5 flex items-center justify-center text-sm font-bold active:scale-95 transition-transform"
        >
          ✕
        </Link>
        <div className="text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            {category.name}
          </span>
          <h2 className="text-xs font-bold text-white mt-0.5">Çalışma Modu</h2>
        </div>
        <div className="h-10 px-3 rounded-xl bg-[#12131a] border border-white/5 flex items-center justify-center text-xs font-bold font-mono text-violet-400">
          ⏱ {formatTime(studySeconds)}
        </div>
      </header>

      {!isFinished ? (
        // SESSION STATE: STUDYING
        <div className="flex-1 flex flex-col justify-between p-5 space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>İlerleme</span>
              <span>
                {Math.min(currentIndex + 1, initialCards.length)} / {initialCards.length} Kart
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* 3D Card Area */}
          <div className="flex-1 flex items-center justify-center py-4">
            {currentCard && (
              <Card
                key={currentCard.id} // Re-mount or re-render card appropriately
                question={currentCard.question}
                answer={currentCard.answer}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
                onDifficultySelect={handleDifficultySelect}
              />
            )}
          </div>

          {/* Quick Instructions / Hints */}
          <p className="text-center text-[11px] text-slate-500 font-medium">
            Kartı çevirmek için üzerine tıklayın. Zor işaretlenen kartlar seans sonuna otomatik olarak tekrar eklenir.
          </p>
        </div>
      ) : (
        // SESSION STATE: COMPLETED
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center space-y-8">
          <div className="bg-[#12131a] border border-white/5 p-8 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl pointer-events-none"></div>

            <div className="inline-flex h-20 w-20 items-center justify-center bg-violet-500/10 border border-violet-500/20 rounded-full text-5xl animate-bounce">
              🎓
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white tracking-tight">Tebrikler!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-violet-400">{category.name}</strong> deste çalışmasını başarıyla tamamladınız.
              </p>
            </div>

            <div className="bg-[#090a0f] border border-white/5 p-4 rounded-2xl grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Çalışma Süresi</span>
                <span className="text-sm font-bold text-zinc-100 font-mono">{formatTime(studySeconds)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Serin</span>
                <span className="text-sm font-bold text-orange-400">🔥 {ProgressManager.getState().streak} Gün</span>
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
              <button
                onClick={handleRestart}
                className="w-full py-3 px-6 rounded-2xl bg-[#12131a] border border-white/5 hover:border-violet-500/20 text-xs font-bold uppercase tracking-wider text-zinc-100 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Tekrar Çalış 🔄
              </button>

              <Link
                href="/"
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-95 transition-all flex items-center justify-center"
              >
                Ana Sayfaya Dön 🏠
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL UP MODAL */}
      {levelUpInfo?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-6">
          <div className="bg-[#12131a] border border-violet-500/30 p-8 rounded-3xl max-w-xs w-full text-center shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>
            
            <div className="text-5xl animate-bounce">⚡</div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-violet-400 uppercase tracking-widest">
                Seviye Atladın!
              </h3>
              <p className="text-2xl font-black text-white">
                Seviye {levelUpInfo.level}
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              Harika gidiyorsun! Yeni seviyene ulaştın ve tecrüben artmaya devam ediyor. 🚀
            </p>

            <button
              onClick={() => setLevelUpInfo(null)}
              className="w-full py-3 px-6 rounded-2xl bg-violet-600 hover:bg-violet-500 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-violet-500/10 active:scale-95 transition-transform cursor-pointer"
            >
              Devam Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
