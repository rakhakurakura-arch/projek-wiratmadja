import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import InternalSidebar from '@/components/InternalSidebar';
import { ShoppingCart, Phone, MapPin, Calendar, Clock } from 'lucide-react';

export default async function InternalOrdersPage() {
  const session = await getSession();
  if (!session) {
    redirect('/internal/login');
  }

  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen bg-ivory-200 text-charcoal-900">
      <InternalSidebar user={session} />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-6xl">
        <div className="border-b border-sage-200 pb-4">
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Riwayat Pesanan Direct WhatsApp</h1>
          <p className="text-xs text-sage-600 mt-1">Daftar transaksi masuk yang dibuat oleh pembeli dari checkout katalog publik.</p>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-sage-200 text-center text-sage-600 text-xs">
              Belum ada data pesanan tercatat.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 border border-sage-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sage-100 pb-3 gap-2">
                  <div>
                    <span className="font-serif font-bold text-base text-forest-900 block">{order.customerName}</span>
                    <span className="text-xs text-sage-600 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-sage-500" /> {order.customerPhone}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-lg text-forest-900 block">{formatRupiah(order.totalAmount)}</span>
                    <span className="text-[11px] text-sage-500 font-mono">
                      {new Date(order.createdAt).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-sage-700 space-y-1">
                  <p className="flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sage-500 mt-0.5" />
                    <span><strong>Alamat:</strong> {order.address}</span>
                  </p>
                  {order.notes && <p className="italic text-sage-600">Catatan: &ldquo;{order.notes}&rdquo;</p>}
                </div>

                <div className="pt-2 border-t border-sage-100 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sage-600 block">Item Produk Dipesan:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="p-2.5 bg-sage-50 rounded-xl text-xs border border-sage-200 flex justify-between items-center">
                        <div>
                          <span className="font-serif font-bold text-charcoal-900 block">{item.productName}</span>
                          {item.variantInfo && <span className="text-[10px] text-forest-800 font-semibold">{item.variantInfo}</span>}
                        </div>
                        <span className="font-bold text-forest-900">
                          {item.quantity}x @ {formatRupiah(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
