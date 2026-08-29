'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InternalSidebar from '@/components/InternalSidebar';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Package, Image as ImageIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface VariantInput {
  name: string;
  value: string;
  price: string;
  stock: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [variants, setVariants] = useState<VariantInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    async function initData() {
      const [catRes, userRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/internal/me'),
      ]);
      const catData = await catRes.json();
      const userData = await userRes.json();

      if (Array.isArray(catData)) {
        setCategories(catData);
        if (catData.length > 0) setCategoryId(catData[0].id);
      }
      if (userData.user) setUserSession(userData.user);
    }
    initData();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: 'Ukuran', value: '', price: '', stock: '10' }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index: number, field: keyof VariantInput, value: string) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !imageUrl || !categoryId) {
      alert('Mohon lengkapi judul, harga dasar, URL gambar, dan kategori.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/internal/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description,
          price: parseInt(price, 10),
          stock: parseInt(stock || '0', 10),
          imageUrl,
          categoryId,
          isFeatured,
          variants: variants.map((v) => ({
            name: v.name,
            value: v.value,
            price: v.price ? parseInt(v.price, 10) : null,
            stock: parseInt(v.stock || '10', 10),
          })),
        }),
      });

      if (res.ok) {
        router.push('/internal/products');
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal membuat produk.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  if (!userSession) return null;

  return (
    <div className="flex min-h-screen bg-ivory-200 text-charcoal-900">
      <InternalSidebar user={userSession} />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-4xl">
        <div className="flex items-center justify-between border-b border-sage-200 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">Tambah Produk Baru</h1>
            <p className="text-xs text-sage-600 mt-1">Masukkan informasi detail produk ke katalog terkurasi Wiratmadja.</p>
          </div>
          <Link
            href="/internal/products"
            className="text-xs font-bold text-forest-800 hover:text-forest-600 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-sage-200 shadow-sm space-y-6">
          
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 border-b border-sage-100 pb-2">Informasi Utama</h3>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                Nama / Judul Produk *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Beras Pandan Wangi Premium Wiratmadja"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Slug URL (Otomatis)
                </label>
                <input
                  type="text"
                  readOnly
                  value={slug}
                  className="w-full bg-sage-50 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm text-sage-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Kategori Produk *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                Deskripsi Lengkap Produk *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tuliskan keunggulan, cita rasa, dan saran pengolahan produk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Harga Dasar (Rupiah) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="85000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Stok Keseluruhan *
                </label>
                <input
                  type="number"
                  required
                  placeholder="45"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                URL Gambar Produk *
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-forest-800 rounded border-sage-300 focus:ring-forest-600"
              />
              <label htmlFor="isFeatured" className="text-xs font-bold text-charcoal-900 cursor-pointer">
                Tandai sebagai Produk Unggulan (Tampil di Highlight Banner)
              </label>
            </div>
          </div>

          {/* Variants Builder Section */}
          <div className="space-y-4 pt-4 border-t border-sage-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-lg text-charcoal-900">Varian Produk (Kemasan/Ukuran/Rasa)</h3>
                <p className="text-xs text-sage-600">Opsional: Tambahkan opsi pilihan jika produk memiliki ukuran berbeda.</p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="bg-sage-100 hover:bg-sage-200 text-forest-900 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Opsi Varian</span>
              </button>
            </div>

            {variants.map((v, idx) => (
              <div key={idx} className="p-4 bg-sage-50 rounded-xl border border-sage-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-bold text-sage-700 mb-1">Jenis (e.g. Kemasan)</label>
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                    className="w-full bg-white border border-sage-200 rounded-lg py-1.5 px-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-sage-700 mb-1">Nilai (e.g. 5 Kg / 10 Kg)</label>
                  <input
                    type="text"
                    required
                    value={v.value}
                    onChange={(e) => handleVariantChange(idx, 'value', e.target.value)}
                    className="w-full bg-white border border-sage-200 rounded-lg py-1.5 px-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-sage-700 mb-1">Harga Khusus (Opsional)</label>
                  <input
                    type="number"
                    placeholder="Sama dengan harga dasar"
                    value={v.price}
                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                    className="w-full bg-white border border-sage-200 rounded-lg py-1.5 px-2.5 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-sage-700 mb-1">Stok Varian</label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                      className="w-full bg-white border border-sage-200 rounded-lg py-1.5 px-2.5 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-sage-200 flex justify-end gap-3">
            <Link
              href="/internal/products"
              className="bg-sage-100 hover:bg-sage-200 text-charcoal-800 font-bold px-5 py-3 rounded-xl text-xs transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-forest-800 hover:bg-forest-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md"
            >
              {loading ? 'Menyimpan Produk...' : 'Simpan Produk Baru'}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
