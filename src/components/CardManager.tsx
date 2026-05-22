"use client";

import { useState, useTransition, useActionState } from "react";
import { createCard, updateCard, deleteCard } from "@/app/actions/cardActions";

interface Category {
  id: string;
  name: string;
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

interface CardManagerProps {
  initialCards: Card[];
  categories: Category[];
}

export function CardManager({ initialCards, categories }: CardManagerProps) {
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isPending, startTransition] = useTransition();

  // Create & Edit form actions
  const [createError, createAction] = useActionState(async (state: any, formData: FormData) => {
    const res = await createCard(state, formData);
    if (res.success) {
      (document.getElementById("create-card-form") as HTMLFormElement)?.reset();
    }
    return res.error;
  }, null);

  const [editError, editAction] = useActionState(async (state: any, formData: FormData) => {
    if (!editingCard) return "Kart seçilmedi.";
    const res = await updateCard(editingCard.id, state, formData);
    if (res.success) {
      setEditingCard(null);
    }
    return res.error;
  }, null);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu bilgi kartını silmek istediğinize emin misiniz?")) {
      return;
    }
    startTransition(async () => {
      const res = await deleteCard(id);
      if (res.error) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Alanı */}
        <div className="md:col-span-1 bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
          {editingCard ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Kartı Düzenle</h3>
                <button
                  onClick={() => setEditingCard(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  İptal Et
                </button>
              </div>
              <form action={editAction} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Kategori Seçin
                  </label>
                  <select
                    name="categoryId"
                    required
                    defaultValue={editingCard.categoryId}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white text-sm outline-none transition-all duration-200"
                  >
                    <option value="" className="bg-[#090a0f]">Seçiniz</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#090a0f]">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Soru (Ön Yüz)
                  </label>
                  <textarea
                    name="question"
                    required
                    defaultValue={editingCard.question}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Cevap (Arka Yüz)
                  </label>
                  <textarea
                    name="answer"
                    required
                    defaultValue={editingCard.answer}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200 resize-none"
                  />
                </div>

                {editError && (
                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs">
                    {editError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-all duration-200"
                >
                  Güncelle
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Yeni Bilgi Kartı Ekle</h3>
              <form id="create-card-form" action={createAction} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Kategori Seçin
                  </label>
                  <select
                    name="categoryId"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white text-sm outline-none transition-all duration-200"
                  >
                    <option value="" className="bg-[#090a0f]">Seçiniz</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#090a0f]">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Soru (Ön Yüz)
                  </label>
                  <textarea
                    name="question"
                    required
                    placeholder="Soru girdisi..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Cevap (Arka Yüz)
                  </label>
                  <textarea
                    name="answer"
                    required
                    placeholder="Cevap girdisi..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200 resize-none"
                  />
                </div>

                {createError && (
                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs">
                    {createError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-all duration-200"
                >
                  Oluştur
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Kartlar Listesi */}
        <div className="md:col-span-2 bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl overflow-hidden">
          <h3 className="text-lg font-bold text-white mb-4">Mevcut Bilgi Kartları</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3 w-1/3">Soru</th>
                  <th className="pb-3 w-1/3">Cevap</th>
                  <th className="pb-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                {initialCards.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      Henüz bilgi kartı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  initialCards.map((card) => (
                    <tr key={card.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 pr-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-950/30 text-violet-300 border border-violet-500/10">
                          {card.category?.name || "Kategorisiz"}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 truncate max-w-[180px] font-medium text-white">
                        {card.question}
                      </td>
                      <td className="py-3.5 pr-4 truncate max-w-[180px] text-slate-400">
                        {card.answer}
                      </td>
                      <td className="py-3.5 text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => setEditingCard(card)}
                          className="text-violet-400 hover:text-violet-300 text-xs font-semibold"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          disabled={isPending}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold disabled:opacity-50"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
