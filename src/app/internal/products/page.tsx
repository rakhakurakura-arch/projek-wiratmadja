import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import InternalSidebar from '@/components/InternalSidebar';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import ProductDeleteButton from './ProductDeleteButton';

export default async function InternalProductsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/internal/login');
  }

  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      variants: true,
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

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sage-200 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">Kelola Produk Katalog</h1>
            <p className="text-xs text-sage-600 mt-1">Tambah, edit, atau hapus produk beserta varian kemasan/ukuran.</p>
          </div>
          <Link
            href="/internal/products/new"
            className="bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-sage-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-sage-100/70 border-b border-sage-200 text-sage-700 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Produk</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Harga Dasar</th>
                  <th className="py-3.5 px-4">Stok</th>
                  <th className="py-3.5 px-4">Varian</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-sage-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-sage-100 overflow-hidden border border-sage-200 flex-shrink-0">
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-serif font-bold text-sm text-charcoal-900 block leading-snug">
                            {product.title}
                          </span>
                          <span className="text-[11px] text-sage-600 font-mono">
                            /{product.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-charcoal-800">
                      {product.category.name}
                    </td>

                    <td className="py-3 px-4 font-serif font-bold text-forest-900">
                      {formatRupiah(product.price)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          product.stock > 5
                            ? 'bg-emerald-50 text-emerald-800'
                            : product.stock > 0
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {product.stock} unit
                      </span>
                    </td>

                    <td className="py-3 px-4 text-sage-700">
                      {product.variants.length > 0 ? (
                        <span className="bg-sage-100 text-forest-900 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {product.variants.length} Varian
                        </span>
                      ) : (
                        <span className="text-sage-400 italic">Tidak ada</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/internal/products/${product.id}/edit`}
                          className="p-2 rounded-lg bg-sage-100 hover:bg-sage-200 text-forest-800 transition-colors"
                          title="Edit Produk"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <ProductDeleteButton productId={product.id} productTitle={product.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
