import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import InternalSidebar from '@/components/InternalSidebar';
import { Package, FolderTree, ShoppingCart, Users, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default async function InternalDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/internal/login');
  }

  const [totalProducts, totalCategories, totalOrders, totalUsers, lowStockProducts, recentAuditLogs] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      take: 5,
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="flex min-h-screen bg-ivory-200 text-charcoal-900">
      <InternalSidebar user={session} />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-sage-200 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">Ringkasan Dashboard Pengelola</h1>
            <p className="text-xs text-sage-600 mt-1">
              Selamat datang kembali, <strong className="text-forest-900">{session.name}</strong>. Anda masuk sebagai {session.role === 'ADMIN' ? 'Pemilik (Admin)' : 'Kontributor Internal'}.
            </p>
          </div>
          <Link
            href="/internal/products/new"
            className="bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>+ Tambah Produk Baru</span>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-5 rounded-2xl border border-sage-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-sage-600">
              <span className="text-xs font-bold uppercase tracking-wider">Total Produk</span>
              <div className="p-2 bg-sage-100 rounded-lg text-forest-800">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-3xl font-bold text-charcoal-900 block">{totalProducts}</span>
            <span className="text-[11px] text-sage-600">Terdaftar di katalog publik</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sage-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-sage-600">
              <span className="text-xs font-bold uppercase tracking-wider">Total Kategori</span>
              <div className="p-2 bg-sage-100 rounded-lg text-forest-800">
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-3xl font-bold text-charcoal-900 block">{totalCategories}</span>
            <span className="text-[11px] text-sage-600">Kelompok kurasi</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sage-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-sage-600">
              <span className="text-xs font-bold uppercase tracking-wider">Pesanan WhatsApp</span>
              <div className="p-2 bg-sage-100 rounded-lg text-forest-800">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-3xl font-bold text-charcoal-900 block">{totalOrders}</span>
            <span className="text-[11px] text-sage-600">Catatan transaksi masuk</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sage-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-sage-600">
              <span className="text-xs font-bold uppercase tracking-wider">Tim Pengelola</span>
              <div className="p-2 bg-sage-100 rounded-lg text-forest-800">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-3xl font-bold text-charcoal-900 block">{totalUsers}</span>
            <span className="text-[11px] text-sage-600">Akun terverifikasi internal</span>
          </div>

        </div>

        {/* Dashboard Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Low Stock Alert Table */}
          <div className="bg-white rounded-2xl border border-sage-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-sage-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-charcoal-900">Peringatan Stok Menipis (≤ 5)</h3>
              </div>
              <Link href="/internal/products" className="text-xs font-bold text-forest-800 hover:underline">
                Kelola Stok
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Semua stok produk terpantau aman dan mencukupi.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-3 bg-sage-50 rounded-xl text-xs border border-sage-200">
                    <span className="font-serif font-bold text-charcoal-900">{p.title}</span>
                    <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full">
                      Sisa: {p.stock}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Audit Log Activity */}
          <div className="bg-white rounded-2xl border border-sage-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-sage-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Aktivitas Terakhir Pengelola</h3>
              <Link href="/internal/audit-logs" className="text-xs font-bold text-forest-800 hover:underline">
                Lihat Semua Log
              </Link>
            </div>

            <div className="space-y-3">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-sage-50/80 rounded-xl text-xs space-y-1 border border-sage-200/60">
                  <div className="flex justify-between text-sage-600">
                    <span className="font-bold text-forest-900">{log.user.name}</span>
                    <span className="text-[10px]">{new Date(log.createdAt).toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-charcoal-800 font-medium">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
