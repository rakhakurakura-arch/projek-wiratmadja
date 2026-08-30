# Panduan Deploy Proyek WIRATMADJA ke Vercel

Panduan ini berisi langkah-langkah men-deploy aplikasi katalog **WIRATMADJA** ke **Vercel**, menggunakan database cloud **Turso** yang sudah disiapkan sebelumnya.

---

## 1. Database Turso (Sudah Siap)

Database Turso (`wiratmadja-db`) dan seluruh tabelnya sudah dibuat dan diisi data awal. Yang diperlukan hanya kredensial berikut untuk dipasang di Vercel:

- **Database URL** (gunakan skema `https://`, BUKAN `libsql://`, karena aplikasi ini menggunakan client HTTP-only): `https://wiratmadja-db-rakhakurakura-arch.aws-ap-northeast-1.turso.io`
- **Auth Token**: buat token baru khusus production lewat dashboard Turso (app.turso.tech > database > Create Token), demi keamanan sebaiknya terpisah dari token yang dipakai untuk keperluan lokal.

---

## 2. Import Project ke Vercel

1. Buka [vercel.com](https://vercel.com), login (bisa langsung pakai akun GitHub).
2. Klik **"Add New" > "Project"**.
3. Pilih **"Import Git Repository"**, cari dan pilih repo `projek-wiratmadja`.
4. Vercel akan otomatis mendeteksi ini sebagai proyek Next.js. Biarkan pengaturan build default (tidak perlu diubah).

---

## 3. Pengaturan Environment Variables di Vercel

Sebelum klik Deploy, buka bagian **"Environment Variables"** di halaman import, isi:

| Nama Variabel | Nilai |
|---|---|
| TURSO_DATABASE_URL | https://wiratmadja-db-rakhakurakura-arch.aws-ap-northeast-1.turso.io |
| TURSO_AUTH_TOKEN | (token production dari langkah 1) |
| JWT_SECRET | String acak baru yang kuat (JANGAN sama dengan .env lokal) |
| NEXT_PUBLIC_WHATSAPP_NUMBER | Nomor WhatsApp toko, format 62 tanpa spasi/tanda + |

---

## 4. Deploy

Klik tombol **"Deploy"**. Tunggu proses build selesai (biasanya 1-2 menit). Setelah selesai, Vercel akan memberikan URL live berformat `https://nama-proyek.vercel.app`.

---

## 5. 🚨 WAJIB: Ganti Password Default

> Akun admin default (`admin@wiratmadja.id` / `admin123`) dan kontributor (`keluarga@wiratmadja.id` / `keluarga123`) ada di kode sumber publik GitHub (`prisma/seed.ts`).
>
> Segera setelah deploy pertama:
> 1. Buka URL live Vercel kamu, akses `/internal/login`.
> 2. Login, masuk ke menu **Kelola User** (`/internal/users`).
> 3. Ganti password kedua akun tersebut dengan password baru yang kuat & rahasia.
