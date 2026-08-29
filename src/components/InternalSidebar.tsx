'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, FolderTree, Users, FileClock, ShoppingCart, LogOut, ShieldCheck, Home } from 'lucide-react';
import { UserSession } from '@/lib/auth';

interface InternalSidebarProps {
  user: UserSession;
}

export default function InternalSidebar({ user }: InternalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/internal/logout', { method: 'POST' });
    router.push('/internal/login');
  };

  const navItems = [
    { label: 'Ringkasan Dashboard', href: '/internal/dashboard', icon: LayoutDashboard },
    { label: 'Kelola Katalog Produk', href: '/internal/products', icon: Package },
    { label: 'Kelola Kategori', href: '/internal/categories', icon: FolderTree },
    { label: 'Riwayat Pesanan WA', href: '/internal/orders', icon: ShoppingCart },
    { label: 'Log Aktivitas (Audit)', href: '/internal/audit-logs', icon: FileClock },
  ];

  if (user.role === 'ADMIN') {
    navItems.push({ label: 'Kelola Pengelola Internal', href: '/internal/users', icon: Users });
  }

  return (
    <aside className="w-64 bg-forest-950 text-sage-200 min-h-screen flex flex-col justify-between p-4 border-r border-forest-900 flex-shrink-0">
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-lg bg-forest-800 text-sage-100 flex items-center justify-center font-serif text-lg font-bold border border-forest-700">
            W
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-white tracking-wide block">
              WIRATMADJA
            </span>
            <span className="text-[10px] text-sage-400 font-medium block -mt-1">
              Internal Governance
            </span>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-3 bg-forest-900/80 border border-forest-800 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-sage-100 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-sage-300" />
            <span className="truncate">{user.name}</span>
          </div>
          <span className="inline-block text-[10px] font-semibold text-sage-300 bg-forest-800 px-2 py-0.5 rounded">
            Role: {user.role === 'ADMIN' ? 'Pemilik (Admin Utama)' : 'Kontributor Keluarga'}
          </span>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-forest-800 text-white border border-forest-700/80 shadow-sm'
                    : 'text-sage-300 hover:bg-forest-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-sage-300" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-forest-900 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-sage-400 hover:text-sage-200 hover:bg-forest-900/50 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Lihat Tampilan Publik</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Portal</span>
        </button>
      </div>
    </aside>
  );
}
