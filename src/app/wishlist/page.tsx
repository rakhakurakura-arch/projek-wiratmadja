'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard, { ProductData } from '@/components/ProductCard';
import VariantModal from '@/components/VariantModal';
import { Heart, ArrowLeft } from 'lucide-react';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function WishlistPage() {
  const wishlistIds = useStore((state) => state.wishlist);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductData | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function fetchWishlistProducts() {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const allProducts: ProductData[] = await res.json();
        const filtered = allProducts.filter((p) => wishlistIds.includes(p.id));
        setProducts(filtered);
      } catch (err) {
        console.error('Failed fetching wishlist products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlistProducts();
  }, [wishlistIds, mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-ivory-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8 border-b border-sage-200 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900 flex items-center gap-3">
              <Heart className="w-7 h-7 text-red-500 fill-current" />
              <span>Produk Favorit Saya</span>
            </h1>
            <p className="text-xs text-sage-600 mt-1">Daftar produk terkurasi yang Anda simpan untuk dibeli kembali.</p>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-forest-800 hover:text-forest-600 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-sage-200 animate-pulse h-64" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-sage-200 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-bold text-xl text-charcoal-900">Belum Ada Favorit Disimpan</h2>
            <p className="text-xs text-sage-600">
              Klik ikon hati pada produk katalog Wiratmadja untuk menandai produk pilihan keluarga Anda.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              <span>Lihat Produk Katalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenVariantModal={(p) => {
                  setSelectedProductForModal(p);
                  setIsVariantModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <VariantModal
        product={selectedProductForModal}
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
      />
    </div>
  );
}
