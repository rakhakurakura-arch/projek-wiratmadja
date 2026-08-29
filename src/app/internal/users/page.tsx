import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import InternalSidebar from '@/components/InternalSidebar';
import { Users, UserPlus, Shield, CheckCircle } from 'lucide-react';
import UserManager from './UserManager';

export default async function InternalUsersPage() {
  const session = await getSession();
  if (!session) {
    redirect('/internal/login');
  }

  // Admin access control enforcement
  if (session.role !== 'ADMIN') {
    redirect('/internal/dashboard');
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex min-h-screen bg-ivory-200 text-charcoal-900">
      <InternalSidebar user={session} />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-5xl">
        <div className="border-b border-sage-200 pb-4">
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Kelola Pengelola Internal (Undangan Khusus)</h1>
          <p className="text-xs text-sage-600 mt-1">
            Tambah atau hapus akun keluarga/orang terdekat yang diberikan akses mengedit produk. Tidak ada pendaftaran umum.
          </p>
        </div>

        <UserManager initialUsers={users} currentUserId={session.id} />
      </main>
    </div>
  );
}
