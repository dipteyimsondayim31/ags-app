"use client";

import { useState } from "react";
import { CategoryManager } from "./CategoryManager";
import { CardManager } from "./CardManager";

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
  category?: {
    name: string;
  };
}

interface AdminDashboardProps {
  categories: Category[];
  cards: Card[];
}

export function AdminDashboard({ categories, cards }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "cards">("categories");

  return (
    <div className="space-y-8">
      {/* İstatistik Özet Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Toplam Kategori</p>
            <p className="text-3xl font-extrabold text-white mt-1">{categories.length}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 text-xl border border-violet-500/10">
            📁
          </div>
        </div>

        <div className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Toplam Bilgi Kartı</p>
            <p className="text-3xl font-extrabold text-white mt-1">{cards.length}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 text-xl border border-violet-500/10">
            📇
          </div>
        </div>
      </div>

      {/* Tab Navigasyonu */}
      <div className="flex border-b border-white/5 space-x-6">
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all duration-200 outline-none ${
            activeTab === "categories"
              ? "border-violet-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Kategori Yönetimi
        </button>
        <button
          onClick={() => setActiveTab("cards")}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all duration-200 outline-none ${
            activeTab === "cards"
              ? "border-violet-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Bilgi Kartı Yönetimi
        </button>
      </div>

      {/* Tab İçerikleri */}
      <div className="transition-all duration-300">
        {activeTab === "categories" ? (
          <CategoryManager initialCategories={categories} />
        ) : (
          <CardManager initialCards={cards} categories={categories} />
        )}
      </div>
    </div>
  );
}
