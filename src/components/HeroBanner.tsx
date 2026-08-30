'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, HeartHandshake, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    title: 'Kehangatan & Kualitas Pilihan Keluarga Wiratmadja',
    subtitle: 'Katalog Kurasi Produk Sembako Premium, Madu Hutan Liar, dan Rempah Heritage',
    badge: 'Produk Terkurasi Alami',
    ctaText: 'Jelajahi Katalog',
    ctaLink: '#catalog',
    bgImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Beras Pandan Wangi & Minyak Kelapa Cold-Pressed',
    subtitle: 'Langsung dari petani lokal tepercaya dengan standar mutu bersih tanpa pengawet sintesis',
    badge: 'Garansi Kemurnian 100%',
    ctaText: 'Lihat Sembako Utama',
    ctaLink: '/?category=sembako-dapur-utama#catalog',
    bgImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Warisan Bumbu Rendang & Teh Herbal Organik',
    subtitle: 'Resep otentik yang diracik istimewa untuk menghadirkan rasa masakan rumahan terbaik',
    badge: 'Cita Rasa Nusantara',
    ctaText: 'Pesan Warisan Rempah',
    ctaLink: '/?category=bumbu-rempah-kurasi#catalog',
    bgImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1600',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative overflow-hidden bg-forest-900 text-white py-12 md:py-20 lg:py-24">
      {/* Background Image Carousel with Overlay */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-35 scale-105 transition-transform duration-10000' : 'opacity-0 scale-100 pointer-events-none'
          }`}
          style={{
            backgroundImage: `url(${slide.bgImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      ))}

      {/* Forest Soft Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-900/90 to-forest-800/80" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-sage-500/40 text-sage-200 text-xs font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sage-300" />
            <span>{slides[currentSlide].badge}</span>
          </div>

          {/* Dynamic Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ivory-100 leading-tight">
            {slides[currentSlide].title}
          </h1>

          {/* Subtitle */}
          <p className="text-sage-200 text-base sm:text-lg font-normal leading-relaxed max-w-xl">
            {slides[currentSlide].subtitle}
          </p>

          {/* Call to action */}
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <a
              href={slides[currentSlide].ctaLink}
              className="inline-flex items-center justify-center gap-2 bg-sage-300 hover:bg-white text-forest-950 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>{slides[currentSlide].ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890'}?text=Halo%20Wiratmadja,%20saya%20ingin%20konsultasi%20pesanan%20katalog`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-sage-400/50 hover:bg-forest-800/60 text-sage-100 px-5 py-3.5 rounded-xl font-medium text-sm transition-all backdrop-blur-sm"
            >
              <span>Tanya via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Value Proposition Highlights */}
        <div className="mt-12 pt-8 border-t border-forest-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-forest-800/70 border border-sage-500/30 text-sage-300">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif">100% Organik & Alami</h4>
              <p className="text-xs text-sage-300 mt-0.5">Dikurasi tanpa pengawet sintesis untuk keluarga.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-forest-800/70 border border-sage-500/30 text-sage-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif">Jaminan Kemurnian Mutu</h4>
              <p className="text-xs text-sage-300 mt-0.5">Inspeksi fisik langsung oleh pengelola Wiratmadja.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-forest-800/70 border border-sage-500/30 text-sage-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif">Pemesanan Mudah & Ramah</h4>
              <p className="text-xs text-sage-300 mt-0.5">Langsung terhubung dengan pengelola via WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="absolute right-4 bottom-4 flex items-center space-x-2 z-20">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-forest-800/70 hover:bg-forest-700 text-sage-200 border border-sage-500/30 backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-forest-800/70 hover:bg-forest-700 text-sage-200 border border-sage-500/30 backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
