'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check, ShoppingBag, MessageSquare, ShieldCheck } from 'lucide-react';
import { ProductData, ProductVariantData } from './ProductCard';
import { useStore } from '@/lib/store';

interface VariantModalProps {
  product: ProductData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VariantModal({ product, isOpen, onClose }: VariantModalProps) {
  const addItem = useStore((state) => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantData | null>(null);

  if (!isOpen || !product) return null;

  // Group variants by name if multiple exist or just list
  const variants = product.variants || [];
  const currentPrice = selectedVariant?.price ?? product.price;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = () => {
    if (variants.length > 0 && !selectedVariant) {
      alert('Silakan pilih salah satu varian terlebih dahulu.');
      return;
    }

    addItem({
      productId: product.id,
      title: product.title,
      price: currentPrice,
      imageUrl: product.imageUrl,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantValue: selectedVariant?.value,
    });

    onClose();
  };

  const handleWhatsAppOrder = () => {
    if (variants.length > 0 && !selectedVariant) {
      alert('Silakan pilih salah satu varian terlebih dahulu.');
      return;
    }

    const variantText = selectedVariant
      ? `\nVarian: ${selectedVariant.name} - ${selectedVariant.value}`
      : '';
    const message = `Halo Wiratmadja, saya berminat membeli produk:\n\n*${product.title}*${variantText}\nHarga: ${formatRupiah(currentPrice)}\n\nApakah stok masih tersedia?`;
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/6281234567890?text=${encodedMsg}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl border border-sage-200 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 bg-ivory-200 border-b border-sage-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-forest-900">
            <ShieldCheck className="w-5 h-5 text-forest-700" />
            <h3 className="font-serif font-bold text-lg">Pilih Varian Produk</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-sage-600 hover:text-charcoal-900 hover:bg-sage-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Product Brief */}
          <div className="flex gap-4 items-center">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-sage-100 flex-shrink-0 border border-sage-200">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs text-sage-600 font-semibold">{product.category.name}</span>
              <h4 className="font-serif font-bold text-base text-charcoal-900 leading-snug">
                {product.title}
              </h4>
              <p className="font-serif font-bold text-lg text-forest-900 mt-1">
                {formatRupiah(currentPrice)}
              </p>
            </div>
          </div>

          {/* Variants Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-2">
              Pilihan Ukuran / Rasa / Kemasan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl border text-left flex justify-between items-center transition-all ${
                      isSelected
                        ? 'border-forest-700 bg-forest-50/60 ring-2 ring-forest-700/20'
                        : 'border-sage-200 hover:border-sage-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs text-sage-600 block">{v.name}</span>
                      <span className="text-sm font-bold text-charcoal-900">{v.value}</span>
                      {v.price && v.price !== product.price && (
                        <span className="text-xs text-forest-800 font-semibold block mt-0.5">
                          {formatRupiah(v.price)}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-forest-800 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-sage-50 border-t border-sage-200 grid grid-cols-2 gap-3">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-sage-200 hover:bg-sage-300 text-forest-950 font-bold py-3 px-4 rounded-xl text-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>+ Keranjang</span>
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-sage-300" />
            <span>Pesan via WA</span>
          </button>
        </div>

      </div>
    </div>
  );
}
