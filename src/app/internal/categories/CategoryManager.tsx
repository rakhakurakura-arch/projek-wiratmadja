'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, FolderTree } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { products: number };
}

export default function CategoryManager({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
      const res = await fetch('/api/internal/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description }),
      });

      if (res.ok) {
        setName('');
        setDescription('');
        router.refresh();
      } else {
        alert('Gagal membuat kategori.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) return;

    try {
      const res = await fetch(`/api/internal/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus kategori.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Create Category Form */}
      <div className="md:col-span-5">
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-charcoal-900 border-b border-sage-100 pb-2">
            Tambah Kategori Baru
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
              Nama Kategori *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kue Kering Heritage"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
              Deskripsi Singkat
            </label>
            <textarea
              rows={3}
              placeholder="Penjelasan singkat mengenai kategori ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-800 hover:bg-forest-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Menyimpan...' : 'Tambah Kategori'}</span>
          </button>
        </form>
      </div>

      {/* Category List */}
      <div className="md:col-span-7">
        <div className="bg-white rounded-2xl border border-sage-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-sage-100/70 border-b border-sage-200">
            <h3 className="font-serif font-bold text-base text-charcoal-900">Daftar Kategori Aktif</h3>
          </div>

          <div className="divide-y divide-sage-100">
            {initialCategories.map((cat) => (
              <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-sage-50/50 transition-colors">
                <div className="space-y-0.5">
                  <h4 className="font-serif font-bold text-sm text-charcoal-900">{cat.name}</h4>
                  <span className="text-[11px] text-sage-600 font-mono block">/{cat.slug}</span>
                  {cat.description && (
                    <p className="text-xs text-sage-700 line-clamp-1">{cat.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-sage-100 text-forest-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                    {cat._count?.products || 0} Produk
                  </span>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
