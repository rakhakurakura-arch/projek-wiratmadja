import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import InternalSidebar from '@/components/InternalSidebar';
import { FileClock, User, Clock, ShieldAlert } from 'lucide-react';

export default async function InternalAuditLogsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/internal/login');
  }

  const auditLogs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: { name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex min-h-screen bg-ivory-200 text-charcoal-900">
      <InternalSidebar user={session} />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-5xl">
        <div className="border-b border-sage-200 pb-4">
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Log Aktivitas Pengelola Internal</h1>
          <p className="text-xs text-sage-600 mt-1">
            Catatan kronologis siapa yang menambah, mengedit, atau menghapus produk & kategori.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-sage-200 overflow-hidden shadow-sm">
          <div className="divide-y divide-sage-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-sage-50/50 transition-colors space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest-900 font-serif">{log.user.name}</span>
                    <span className="text-[10px] bg-sage-100 text-forest-800 font-semibold px-2 py-0.5 rounded">
                      {log.user.role === 'ADMIN' ? 'Admin' : 'Kontributor'}
                    </span>
                  </div>
                  <span className="text-sage-500 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.createdAt).toLocaleString('id-ID')}
                  </span>
                </div>

                <p className="text-xs text-charcoal-800 font-medium">
                  {log.details}
                </p>

                <div className="text-[10px] text-sage-500 font-mono">
                  Aksi: <code className="bg-sage-100 px-1 py-0.5 rounded text-sage-800">{log.action}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
