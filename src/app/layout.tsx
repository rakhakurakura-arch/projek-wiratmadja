import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wiratmadja | Katalog Produk Authentic & Terkurasi',
  description: 'Katalog produk pilihan Wiratmadja. Temukan produk kebutuhan pokok, bumbu heritage, minuman herbal, dan camilan rumahan dengan pemesanan langsung via WhatsApp.',
  keywords: ['Wiratmadja', 'Katalog Produk', 'Beras Premium', 'Madu Hutan', 'Bumbu Heritage', 'E-Commerce'],
  authors: [{ name: 'Wiratmadja' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory-200 text-charcoal-900 selection:bg-forest-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
