import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import InternalSidebar from '@/components/InternalSidebar';
import { FolderTree, Plus, Trash2 } from 'lucide-react';
import CategoryManager from './CategoryManager';

export default async function InternalCategoriesPage() {
  const session = await getSession();
  if (!session) {
    redirect('/internal/login');
  }

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="flex min-h-screen bg-ivory-200 text-charcoal-900">
      <InternalSidebar user={session} />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-5xl">
        <div className="border-b border-sage-200 pb-4">
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Kelola Kategori Produk</h1>
          <p className="text-xs text-sage-600 mt-1">Struktur kelompok katalog produk keluarga Wiratmadja.</p>
        </div>

        <CategoryManager initialCategories={categories} />
      </main>
    </div>
  );
}
