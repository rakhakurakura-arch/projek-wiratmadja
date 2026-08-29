'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Shield, Leaf, ArrowUpRight, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-sage-200 pt-16 pb-8 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-forest-900/80">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-forest-800 text-sage-100 flex items-center justify-center font-serif text-xl font-bold border border-forest-700">
                W
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                WIRATMADJA
              </span>
            </div>
            <p className="text-xs text-sage-300 leading-relaxed">
              Katalog produk terkurasi khas Wiratmadja. Menghadirkan sembako kualitas unggulan, bumbu warisan keluarga, minuman organik, dan camilan alami dengan alur transaksi transparan & ramah.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-sage-400">
              <Shield className="w-4 h-4 text-sage-300" />
              <span>Akses Katalog Terbuka Public</span>
            </div>
          </div>

          {/* Navigasi Katalog */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">Navigasi Katalog</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Semua Produk Katalog</span>
                </Link>
              </li>
              <li>
                <Link href="/?category=sembako-dapur-utama" className="hover:text-white transition-colors">
                  Sembako & Dapur Utama
                </Link>
              </li>
              <li>
                <Link href="/?category=minuman-organic-herbal" className="hover:text-white transition-colors">
                  Minuman Organic & Herbal
                </Link>
              </li>
              <li>
                <Link href="/?category=bumbu-rempah-kurasi" className="hover:text-white transition-colors">
                  Bumbu Warisan Wiratmadja
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  Artikel & Jurnal Heritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Jam Operasional & Layanan */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">Jam Layanan & Info</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sage-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Operasional Pemesanan:</span>
                  <span className="text-sage-300">Senin - Sabtu: 08:00 - 20:00 WIB</span>
                  <span className="text-sage-400 block text-[11px]">Minggu & Hari Libur tetap menerima order WA</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Leaf className="w-4 h-4 text-sage-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Metode Pengiriman:</span>
                  <span className="text-sage-300">Kurir Langsung & Ekspedisi Terpercaya</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kontak Resmi */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">Hubungi Kami</h4>
            <div className="space-y-2.5 text-xs">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Wiratmadja,%20saya%20ingin%20memesan%20produk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 bg-forest-900/80 hover:bg-forest-800 border border-forest-800 rounded-xl text-sage-100 hover:text-white transition-all group"
              >
                <Phone className="w-4 h-4 text-sage-300 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold block text-xs">WhatsApp Direct Admin</span>
                  <span className="text-[11px] text-sage-300">+62 812-3456-7890</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-sage-400" />
              </a>

              <div className="flex items-center gap-2.5 text-sage-300">
                <Mail className="w-4 h-4 text-sage-400" />
                <span>kontak@wiratmadja.id</span>
              </div>
              <div className="flex items-start gap-2.5 text-sage-300">
                <MapPin className="w-4 h-4 text-sage-400 mt-0.5" />
                <span>Jl. Kurasi No. 24, Jakarta Selatan, Indonesia</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & discrete internal staff login link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage-400">
          <p>© {new Date().getFullYear()} Wiratmadja. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <span>Katalog Produk Resmi</span>
            {/* Discrete Internal Portal Login Link */}
            <Link
              href="/internal/login"
              className="flex items-center gap-1.5 text-sage-400 hover:text-sage-200 transition-colors py-1 px-2 rounded hover:bg-forest-900/50"
              title="Khusus Pengelola Internal Wiratmadja"
            >
              <Lock className="w-3 h-3 text-sage-400" />
              <span>Akses Internal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
