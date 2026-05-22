"use client";

import { useState, useTransition, useActionState } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/categoryActions";

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  _count?: {
    cards: number;
  };
}

interface CategoryManagerProps {
  initialCategories: Category[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();

  // Create & Edit form state handlers
  const [createError, createAction] = useActionState(async (state: any, formData: FormData) => {
    const res = await createCategory(state, formData);
    if (res.success) {
      // Clear inputs manually if needed or reset form
      (document.getElementById("create-category-form") as HTMLFormElement)?.reset();
    }
    return res.error;
  }, null);

  const [editError, editAction] = useActionState(async (state: any, formData: FormData) => {
    if (!editingCategory) return "Kategori seçilmedi.";
    const res = await updateCategory(editingCategory.id, state, formData);
    if (res.success) {
      setEditingCategory(null);
    }
    return res.error;
  }, null);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? Kategoriye ait TÜM bilgi kartları silinecektir!")) {
      return;
    }
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.error) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Kategori Ekleme / Düzenleme Alanı */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
          {editingCategory ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Kategoriyi Düzenle</h3>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  İptal Et
                </button>
              </div>
              <form action={editAction} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Kategori Adı
                  </label>
                  <input
                    name="name"
                    required
                    defaultValue={editingCategory.name}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingCategory.description || ""}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    İkon (Emoji veya İsim)
                  </label>
                  <input
                    name="icon"
                    defaultValue={editingCategory.icon || ""}
                    placeholder="📚"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
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
              <h3 className="text-lg font-bold text-white mb-4">Yeni Kategori Ekle</h3>
              <form id="create-category-form" action={createAction} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Kategori Adı
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="Örn: Anayasa Hukuku"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    placeholder="Kategori hakkında kısa açıklama..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    İkon (Emoji veya İsim)
                  </label>
                  <input
                    name="icon"
                    placeholder="📚"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
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

        {/* Kategori Listesi */}
        <div className="md:col-span-2 bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl overflow-hidden">
          <h3 className="text-lg font-bold text-white mb-4">Mevcut Kategoriler</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 w-16">İkon</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">Kart Sayısı</th>
                  <th className="pb-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                {initialCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      Henüz kategori bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  initialCategories.map((category) => (
                    <tr key={category.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 text-lg">{category.icon || "📁"}</td>
                      <td className="py-3.5">
                        <div className="font-semibold text-white">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-slate-400 max-w-sm truncate mt-0.5">
                            {category.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-400 font-medium">
                        {category._count?.cards ?? 0} kart
                      </td>
                      <td className="py-3.5 text-right space-x-3">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="text-violet-400 hover:text-violet-300 text-xs font-semibold"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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
