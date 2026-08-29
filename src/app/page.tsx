'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import ProductCard, { ProductData } from '@/components/ProductCard';
import VariantModal from '@/components/VariantModal';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Search, Filter, Sparkles, Star, Quote, ArrowRight, BookOpen } from 'lucide-react';

interface HomeProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default function Home({ searchParams }: HomeProps) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductData | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function initParams() {
      const resolvedParams = await searchParams;
      setActiveCategory(resolvedParams?.category || '');
      setSearchQuery(resolvedParams?.search || '');
    }
    initParams();
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeCategory) queryParams.set('category', activeCategory);
        if (searchQuery) queryParams.set('search', searchQuery);

        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products?${queryParams.toString()}`),
          fetch('/api/categories'),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (Array.isArray(prodData)) setProducts(prodData);
        if (Array.isArray(catData)) setCategories(catData);
      } catch (err) {
        console.error('Failed fetching storefront data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeCategory, searchQuery]);

  const handleOpenVariantModal = (product: ProductData) => {
    setSelectedProductForModal(product);
    setIsVariantModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-200">
      <Navbar categories={categories} />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner />

        {/* Catalog Section Header */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sage-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-forest-700 text-xs font-bold uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Katalog Terkurasi Wiratmadja</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900">
                {activeCategory
                  ? categories.find((c) => c.slug === activeCategory)?.name || 'Katalog Produk'
                  : 'Pilihan Produk Pilihan'}
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveCategory('')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  !activeCategory
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-white text-charcoal-700 border border-sage-200 hover:bg-sage-100'
                }`}
              >
                Semua Produk
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat.slug
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-white text-charcoal-700 border border-sage-200 hover:bg-sage-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-sage-200 space-y-4 animate-pulse">
                  <div className="aspect-square bg-sage-100 rounded-xl" />
                  <div className="h-4 bg-sage-100 rounded w-3/4" />
                  <div className="h-3 bg-sage-100 rounded w-1/2" />
                  <div className="h-8 bg-sage-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-sage-200 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-sage-100 text-forest-700 mx-auto flex items-center justify-center font-serif text-xl font-bold">
                W
              </div>
              <h3 className="font-serif font-bold text-xl text-charcoal-900">Produk Tidak Ditemukan</h3>
              <p className="text-sm text-sage-600">
                Maaf, tidak ada produk yang cocok dengan kategori atau kata kunci pencarian Anda saat ini.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('');
                  setSearchQuery('');
                }}
                className="bg-forest-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-forest-700 transition-colors"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenVariantModal={handleOpenVariantModal}
                />
              ))}
            </div>
          )}
        </section>

        {/* Customer Testimonials Section */}
        <section className="bg-sage-100/60 border-y border-sage-200/80 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
              <span className="text-xs font-bold text-forest-700 tracking-widest uppercase">Kepercayaan & Kepuasan</span>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900">Cerita Pengalaman Pelanggan Wiratmadja</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-charcoal-800 leading-relaxed font-normal italic">
                  &ldquo;Beras Pandan Wanginya sangat pulen dan aromanya alami sekali. Sangat terasa bedanya dengan beras pasaran biasa. Layanan pemesanan via WA juga ramah dan cepat sampai.&rdquo;
                </p>
                <div className="pt-2 border-t border-sage-100">
                  <h4 className="font-serif font-bold text-sm text-forest-900">Ibu Ratna S.</h4>
                  <span className="text-[11px] text-sage-600">Pelanggan Setia Kebayoran Baru</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-charcoal-800 leading-relaxed font-normal italic">
                  &ldquo;Madu Hutan Liar Wiratmadja ini benar-benar raw honey murni. Anak-anak di rumah suka sekali dan tenggorokan terasa lega. Salut untuk standar kurasi pengelola.&rdquo;
                </p>
                <div className="pt-2 border-t border-sage-100">
                  <h4 className="font-serif font-bold text-sm text-forest-900">Bapak Hendra W.</h4>
                  <span className="text-[11px] text-sage-600">Konsumen Madu Organik</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-charcoal-800 leading-relaxed font-normal italic">
                  &ldquo;Bumbu rendangnya juara! Tinggal tambahkan santan dan daging, rasa rendang otentik warisan langsung terasa. Praktis dan kualitas rasa restoran heritage.&rdquo;
                </p>
                <div className="pt-2 border-t border-sage-100">
                  <h4 className="font-serif font-bold text-sm text-forest-900">Ibu Maya Dewi</h4>
                  <span className="text-[11px] text-sage-600">Penggemar Kuliner Nusantara</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Short SEO Articles / Blog Highlights */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex justify-between items-end mb-8 border-b border-sage-200 pb-4">
            <div>
              <span className="text-xs font-bold text-forest-700 tracking-widest uppercase">Edukasi & Jurnal</span>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900">Artikel & Panduan Memilih Produk</h2>
            </div>
            <Link href="/articles" className="text-xs font-bold text-forest-800 hover:text-forest-600 flex items-center gap-1">
              <span>Lihat Semua Artikel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-sage-200 overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-2/5 relative h-48 sm:h-auto bg-sage-100">
                <img
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600"
                  alt="Panduan Beras Organik"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 sm:w-3/5 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600">Tips Sembako</span>
                  <h3 className="font-serif font-bold text-base text-charcoal-900 leading-snug">
                    Cara Membedakan Beras Pandan Wangi Murni dengan Beras Pewangi Sintesis
                  </h3>
                  <p className="text-xs text-sage-600 line-clamp-2 mt-1">
                    Ketahui ciri fisik aroma beras alami saat diseduh air hangat dan tekstur bulir pulen setelah dimasak.
                  </p>
                </div>
                <Link href="/articles" className="text-xs font-bold text-forest-800 hover:underline pt-2 inline-flex items-center gap-1">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-sage-200 overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-2/5 relative h-48 sm:h-auto bg-sage-100">
                <img
                  src="https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=600"
                  alt="Khasiat Madu Raw Honey"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 sm:w-3/5 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600">Kesehatan Herbal</span>
                  <h3 className="font-serif font-bold text-base text-charcoal-900 leading-snug">
                    Manfaat Madu Hutan Mentah (Raw Honey) Tanpa Pasteurisasi untuk Imunitas
                  </h3>
                  <p className="text-xs text-sage-600 line-clamp-2 mt-1">
                    Mengapa enzim aktif dalam madu murni sangat efektif membantu daya tahan tubuh keluarga sehari-hari.
                  </p>
                </div>
                <Link href="/articles" className="text-xs font-bold text-forest-800 hover:underline pt-2 inline-flex items-center gap-1">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Variant Selector Modal */}
      <VariantModal
        product={selectedProductForModal}
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
      />
    </div>
  );
}
