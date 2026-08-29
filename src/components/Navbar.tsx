'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Phone, ShieldCheck, Clock } from 'lucide-react';
import { useStore } from '@/lib/store';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar({ categories = [] }: { categories?: Category[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const getTotalItems = useStore((state) => state.getTotalItems);
  const wishlist = useStore((state) => state.wishlist);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = mounted ? getTotalItems() : 0;
  const totalWishlistItems = mounted ? wishlist.length : 0;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-forest-800 text-sage-100 text-xs py-2 px-4 border-b border-forest-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-300" /> Katalog Resmi & Kurasi Keluarga Wiratmadja
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-sage-200">
              <Clock className="w-3.5 h-3.5 text-sage-300" /> Jam Layanan: 08:00 - 20:00 WIB
            </span>
          </div>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Wiratmadja,%20saya%20ingin%20bertanya%20mengenai%20katalog%20produk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-sage-300" />
            <span>Customer Service: +62 812-3456-7890</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`bg-ivory-200/95 backdrop-blur-md border-b transition-all ${
          isScrolled ? 'border-sage-200 shadow-sm py-3' : 'border-sage-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark & Initial Icon */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-forest-800 text-sage-100 flex items-center justify-center font-serif text-xl font-bold shadow-sm group-hover:bg-forest-700 transition-colors">
              W
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-forest-900 group-hover:text-forest-700 transition-colors">
                WIRATMADJA
              </span>
              <span className="text-[10px] tracking-widest text-sage-600 uppercase font-medium -mt-1">
                Authentic Catalog
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <input
              type="text"
              placeholder="Cari beras, madu, bumbu heritage, atau camilan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-sage-200 rounded-full py-2 pl-4 pr-10 text-sm text-charcoal-900 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-sage-600 hover:text-forest-800 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation Links & Action Badges */}
          <div className="flex items-center space-x-5">
            {/* Desktop Categories Dropdown */}
            <div className="hidden lg:relative lg:block">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-charcoal-800 hover:text-forest-800 py-1 transition-colors"
              >
                <span>Kategori Produk</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-sage-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link
                    href="/"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-charcoal-800 hover:bg-sage-100 hover:text-forest-800"
                  >
                    Semua Produk
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/?category=${cat.slug}`}
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-sage-100 hover:text-forest-800 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/articles" className="hidden lg:block text-sm font-medium text-charcoal-800 hover:text-forest-800 transition-colors">
              Artikel & Resep
            </Link>

            {/* Wishlist Icon */}
            <Link href="/wishlist" className="relative p-2 text-charcoal-800 hover:text-forest-800 transition-colors" title="Wishlist">
              <Heart className="w-5 h-5" />
              {totalWishlistItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-sage-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-sage-200" />
              <span className="hidden sm:inline">Keranjang</span>
              {totalCartItems > 0 && (
                <span className="bg-sage-300 text-forest-900 px-2 py-0.5 rounded-full text-xs font-bold">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal-800 hover:text-forest-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-sage-200 px-4 pt-3 pb-6 space-y-4 animate-in fade-in">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-ivory-200 border border-sage-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-600">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-sage-600">Kategori</p>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm py-1.5 font-medium text-charcoal-800 hover:text-forest-800"
              >
                Semua Produk
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm py-1.5 text-charcoal-700 hover:text-forest-800"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-sage-200 flex justify-between items-center text-sm">
              <Link href="/articles" onClick={() => setMobileMenuOpen(false)} className="font-medium text-charcoal-800">
                Artikel & Resep Heritage
              </Link>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="font-medium text-forest-800">
                Favorit Saya ({totalWishlistItems})
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
