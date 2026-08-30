'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, ArrowLeft, MessageSquare, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useStore, CartItem } from '@/lib/store';

export default function CartPage() {
  const items = useStore((state) => state.items);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeItem = useStore((state) => state.removeItem);
  const clearCart = useStore((state) => state.clearCart);
  const getTotalPrice = useStore((state) => state.getTotalPrice);
  
  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalPrice = getTotalPrice();

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckoutWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Mohon isi nama lengkap, nomor WhatsApp, dan alamat pengiriman Anda.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save order to database
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          address: customerAddress,
          notes: customerNotes,
          totalAmount: totalPrice,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            productName: item.title,
            variantInfo: item.variantValue ? `${item.variantName || 'Varian'}: ${item.variantValue}` : null,
            quantity: item.quantity,
          })),
        }),
      });

      // Construct formatted WhatsApp Message
      let message = `*PESANAN BARU KATALOG WIRATMADJA*\n\n`;
      message += `*Data Pemesan:*\n`;
      message += `• Nama: ${customerName}\n`;
      message += `• No. WA: ${customerPhone}\n`;
      message += `• Alamat: ${customerAddress}\n`;
      if (customerNotes) message += `• Catatan: ${customerNotes}\n`;
      message += `\n*Daftar Produk:*\n`;

      items.forEach((item, idx) => {
        const variantText = item.variantValue ? ` (${item.variantValue})` : '';
        message += `${idx + 1}. *${item.title}*${variantText}\n   ${item.quantity}x @ ${formatRupiah(item.price)} = *${formatRupiah(item.price * item.quantity)}*\n`;
      });

      message += `\n*Total Tagihan: ${formatRupiah(totalPrice)}*\n\n`;
      message += `Mohon info rekening pembayaran dan konfirmasi ketersediaan pengiriman. Terima kasih.`;

      const encoded = encodeURIComponent(message);
      const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
      window.open(`https://wa.me/${waNum}?text=${encoded}`, '_blank');
      clearCart();
    } catch (err) {
      console.error('Failed creating order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-sage-600 mb-6">
          <Link href="/" className="hover:text-forest-800">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-charcoal-900">Keranjang Belanja</span>
        </div>

        <div className="flex justify-between items-end mb-8 border-b border-sage-200 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">Keranjang Belanja Anda</h1>
            <p className="text-xs text-sage-600 mt-1">Periksa item pilihan Anda dan lakukan pesanan langsung via WhatsApp.</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Keranjang</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-sage-200 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-sage-100 text-forest-800 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-bold text-xl text-charcoal-900">Keranjang Belanja Masih Kosong</h2>
            <p className="text-xs text-sage-600">
              Anda belum memasukkan produk apa pun. Silakan jelajahi katalog authentic Wiratmadja untuk menambahkan produk pilihan.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Jelajahi Katalog Produk</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.variantId || idx}`}
                  className="bg-white rounded-2xl p-4 border border-sage-200 flex gap-4 items-center justify-between shadow-sm"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-sage-50 flex-shrink-0 border border-sage-200">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className="font-serif font-bold text-base text-charcoal-900 leading-snug">
                      {item.title}
                    </h3>
                    {item.variantValue && (
                      <span className="inline-block text-[11px] font-semibold text-forest-800 bg-sage-100 px-2 py-0.5 rounded">
                        Varian: {item.variantValue}
                      </span>
                    )}
                    <p className="font-serif font-bold text-sm text-forest-900">
                      {formatRupiah(item.price)}
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center border border-sage-200 rounded-lg overflow-hidden bg-sage-50">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        className="w-8 h-8 font-bold text-charcoal-700 hover:bg-sage-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-charcoal-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        className="w-8 h-8 font-bold text-charcoal-700 hover:bg-sage-200 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-sage-100/70 border border-sage-200 rounded-2xl flex items-center gap-3 text-xs text-forest-900">
                <ShieldCheck className="w-5 h-5 text-forest-700 flex-shrink-0" />
                <span>Setiap pesanan diproses secara manual dan diinspeksi kebersihannya oleh tim pengelola Wiratmadja.</span>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-md space-y-6 sticky top-28">
                <div className="border-b border-sage-200 pb-4">
                  <h2 className="font-serif font-bold text-xl text-charcoal-900">Form Pemesanan Direct</h2>
                  <p className="text-xs text-sage-600 mt-1">Lengkapi alamat untuk mendapatkan format pemesanan WhatsApp otomatis.</p>
                </div>

                <form onSubmit={handleCheckoutWhatsApp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                      Nama Lengkap Pemesan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ibu Rahmawati"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                      Alamat Pengiriman Lengkap *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Jalan, No. Rumah, RT/RW, Kecamatan, Kota..."
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                      Catatan Khusus (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Titip di satpam / packing ekstra"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>

                  <div className="pt-4 border-t border-sage-200 space-y-2">
                    <div className="flex justify-between text-xs text-sage-700">
                      <span>Total Subtotal:</span>
                      <span className="font-semibold">{formatRupiah(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-sage-700">
                      <span>Ongkos Kirim:</span>
                      <span className="font-semibold italic text-forest-700">Dikonfirmasi via WA</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-forest-950 pt-2 border-t border-sage-100">
                      <span>Total Pesanan:</span>
                      <span className="font-serif text-lg text-forest-900">{formatRupiah(totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-forest-800 hover:bg-forest-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-sage-300" />
                    <span>{isSubmitting ? 'Memproses Order...' : 'Kirim Pesanan via WhatsApp'}</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
