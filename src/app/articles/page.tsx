'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { BookOpen, Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Cara Membedakan Beras Pandan Wangi Murni dengan Beras Pewangi Sintesis',
    category: 'Panduan Sembako',
    date: '28 Agustus 2026',
    author: 'Tim Kurasi Wiratmadja',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    summary: 'Aroma beras pandan wangi alami keluar perlahan saat dibilas dan dimasak. Ketahui perbedaan bulir transparan murni dan bahaya bahan pewangi sintesis bagi kesehatan keluarga.',
  },
  {
    id: 2,
    title: 'Manfaat Madu Hutan Mentah (Raw Honey) Tanpa Pasteurisasi untuk Imunitas',
    category: 'Kesehatan Herbal',
    date: '22 Agustus 2026',
    author: 'Aditya Wiratmadja',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=800',
    summary: 'Madu mentah alami menjaga keutuhan enzim diastase dan propolis alami. Simak tips konsumsi madu hangat di pagi hari untuk menjaga energi dan daya tahan tubuh.',
  },
  {
    id: 3,
    title: 'Rahasia Bumbu Rendang Sangrai Warisan Khas Kuliner Heritage',
    category: 'Resep Rumahan',
    date: '15 Agustus 2026',
    author: 'Tim Dapur Wiratmadja',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    summary: 'Teknik penyangraian rempah utuh (ketumbar, jintan, kapulaga) adalah kunci keharuman rendang yang meresap hingga ke serat daging tanpa memerlukan pengawet.',
  },
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="flex justify-between items-end mb-8 border-b border-sage-200 pb-4">
          <div>
            <span className="text-xs font-bold text-forest-700 uppercase tracking-widest">Edukasi & Catatan</span>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">Jurnal Heritage & Panduan Mutu</h1>
          </div>
          <Link href="/" className="text-xs font-bold text-forest-800 hover:text-forest-600 flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-2xl border border-sage-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-video w-full bg-sage-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-forest-800 text-sage-100 text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-[11px] text-sage-600">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {article.author}</span>
                  </div>

                  <h2 className="font-serif font-bold text-lg text-charcoal-900 leading-snug hover:text-forest-700 transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-xs text-sage-700 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-sage-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-800 flex items-center gap-1">
                    Baca Artikel Lengkap <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
