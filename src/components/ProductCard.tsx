'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, MessageSquare, Check, Eye } from 'lucide-react';
import { useStore } from '@/lib/store';

export interface ProductVariantData {
  id: string;
  name: string;
  value: string;
  price?: number | null;
  stock: number;
}

export interface ProductData {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  isFeatured: Boolean;
  category: {
    name: string;
    slug: string;
  };
  variants: ProductVariantData[];
}

interface ProductCardProps {
  product: ProductData;
  onOpenVariantModal: (product: ProductData) => void;
}

export default function ProductCard({ product, onOpenVariantModal }: ProductCardProps) {
  const addItem = useStore((state) => state.addItem);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isFavorite = isInWishlist(product.id);
  const hasVariants = product.variants && product.variants.length > 0;

  const handleAddToCart = () => {
    if (hasVariants) {
      onOpenVariantModal(product);
    } else {
      addItem({
        productId: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
  };

  const handleWhatsAppOrder = () => {
    if (hasVariants) {
      onOpenVariantModal(product);
    } else {
      const message = `Halo Wiratmadja, saya berminat membeli produk:\n\n*${product.title}*\nHarga: ${formatRupiah(product.price)}\n\nApakah stok masih tersedia?`;
      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/6281234567890?text=${encodedMsg}`, '_blank');
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-sage-200/80 overflow-hidden flex flex-col hover:shadow-md hover:border-forest-400/50 transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-sage-50 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-forest-800/90 text-sage-100 text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm shadow-sm">
            {product.category.name}
          </span>
          {product.isFeatured && (
            <span className="bg-sage-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Unggulan
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-red-50 text-red-600 shadow-sm'
              : 'bg-white/80 text-charcoal-700 hover:bg-white hover:text-red-500'
          }`}
          title="Tambah ke Favorit"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/product/${product.id}`} className="group-hover:text-forest-700 transition-colors">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-charcoal-700 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Variant Indicator if available */}
        {hasVariants && (
          <div className="inline-flex items-center gap-1.5 text-[11px] text-sage-700 bg-sage-50 px-2.5 py-1 rounded-md border border-sage-200/60 font-medium">
            <span>Tersedia {product.variants.length} Varian</span>
          </div>
        )}

        {/* Price & Stock */}
        <div className="pt-2 border-t border-sage-100 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-sage-600 font-medium block">Harga</span>
            <span className="font-serif text-lg font-bold text-forest-900">
              {formatRupiah(product.price)}
            </span>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              product.stock > 0
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {product.stock > 0 ? `Stok ${product.stock}` : 'Habis'}
          </span>
        </div>

        {/* Action Buttons: Add to Cart & Pesan via WhatsApp */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex items-center justify-center gap-1.5 bg-sage-100 hover:bg-sage-200 text-forest-900 py-2 px-3 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>+ Keranjang</span>
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="flex items-center justify-center gap-1.5 bg-forest-800 hover:bg-forest-700 text-white py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sage-300" />
            <span>Pesan WA</span>
          </button>
        </div>
      </div>
    </div>
  );
}
