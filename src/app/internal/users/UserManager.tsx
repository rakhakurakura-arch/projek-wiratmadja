'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Trash2, ShieldCheck, User } from 'lucide-react';

interface InternalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
}

export default function UserManager({ initialUsers, currentUserId }: { initialUsers: InternalUser[]; currentUserId: string }) {
  const [users, setUsers] = useState<InternalUser[]>(initialUsers);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CONTRIBUTOR' | 'ADMIN'>('CONTRIBUTOR');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    try {
      const res = await fetch('/api/internal/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        setName('');
        setEmail('');
        setPassword('');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menambahkan akun kontributor.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, userName: string) => {
    if (id === currentUserId) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.');
      return;
    }
    if (!confirm(`Hapus akses pengelola internal untuk "${userName}"?`)) return;

    try {
      const res = await fetch(`/api/internal/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Gagal menghapus pengguna.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Create User Form */}
      <div className="md:col-span-5">
        <form onSubmit={handleCreateUser} className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-charcoal-900 border-b border-sage-100 pb-2">
            Undang Kontributor Internal Baru
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
              Nama Pengelola (Keluarga/Staf) *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Wiratmadja"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
              Email Akses *
            </label>
            <input
              type="email"
              required
              placeholder="budi@wiratmadja.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
              Kata Sandi Awal *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
              Hak Akses (Role)
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-ivory-200 border border-sage-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              <option value="CONTRIBUTOR">Kontributor (Bisa Tambah & Edit Produk)</option>
              <option value="ADMIN">Admin / Pemilik (Akses Penuh)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-800 hover:bg-forest-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Membuat Akun...' : 'Buat Akun Pengelola'}</span>
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="md:col-span-7">
        <div className="bg-white rounded-2xl border border-sage-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-sage-100/70 border-b border-sage-200">
            <h3 className="font-serif font-bold text-base text-charcoal-900">Daftar Akun Pengelola Aktif</h3>
          </div>

          <div className="divide-y divide-sage-100">
            {initialUsers.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between hover:bg-sage-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold font-serif text-sm">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal-900">{u.name}</h4>
                    <span className="text-xs text-sage-600">{u.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'ADMIN'
                        ? 'bg-forest-800 text-white'
                        : 'bg-sage-100 text-forest-900'
                    }`}
                  >
                    {u.role === 'ADMIN' ? 'Admin / Pemilik' : 'Kontributor'}
                  </span>

                  {u.id !== currentUserId && (
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Pengguna"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
