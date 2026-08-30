# Panduan Deploy Proyek WIRATMADJA ke Vercel

Panduan ini berisi langkah-langkah singkat dan praktis untuk men-deploy aplikasi katalog **WIRATMADJA** ke Vercel dengan database SQLite berbasis cloud (**Turso**).

---

## 1. Membuat Database Turso & Mendapatkan Kredensial

Platform serverless seperti Vercel menggunakan *ephemeral filesystem* (penyimpanan sementara). Oleh karena itu, kita menggunakan **Turso** (SQLite cloud yang kompatibel penuh dengan Prisma).

### Cara A: Melalui Dashboard Web Turso
1. Buat akun atau login di [Turso Console (turso.tech)](https://turso.tech/).
2. Buat database baru (misal diberi nama: wiratmadja-db).
3. Dapatkan **Database URL** (berawalan libsql://...).
4. Buat **Auth Token** baru di bagian *Tokens* / *Security* pada dashboard database tersebut.

### Cara B: Melalui Turso CLI
`ash
# 1. Install Turso CLI & login
npm i -g turso
turso auth login

# 2. Buat database
turso db create wiratmadja-db

# 3. Dapatkan Database URL
turso db show wiratmadja-db --url

# 4. Generate Auth Token
turso db tokens create wiratmadja-db
`

---

## 2. Pengaturan Environment Variables di Vercel

Saat menambahkan proyek di **Dashboard Vercel** (*Project Settings > Environment Variables*), isi variabel-variabel berikut:

| Nama Variabel | Penjelasan | Contoh Nilai |
|---|---|---|
| TURSO_DATABASE_URL | URL database Turso | libsql://wiratmadja-db-username.turso.io |
| TURSO_AUTH_TOKEN | Token otentikasi database Turso | eyJhbGciOi... |
| JWT_SECRET | Secret key untuk enkripsi session token | String acak baru & aman (berbeda dari local dev) |
| NEXT_PUBLIC_WHATSAPP_NUMBER | Nomor WhatsApp CS / Admin Toko | 6281234567890 (format 62 tanpa + / spasi) |

> ⚠️ **PERHATIAN KEAMANAN (JWT_SECRET):**
> Pastikan JWT_SECRET di Vercel diisi dengan string acak baru yang kuat (misal generated via openssl rand -base64 32). Jangan gunakan nilai default yang ada di .env lokal!

---

## 3. Migrasi Skema & Seeding Database Turso Pertama Kali

Sebelum aplikasi di-deploy / diakses di Vercel, jalankan perintah berikut dari komputer lokal (atau terminal proyek) yang sudah membaca TURSO_DATABASE_URL dan TURSO_AUTH_TOKEN Turso production:

### Langkah A: Push Schema ke Turso
`ash
# Set environment variable Turso sementara (PowerShell Windows)
=" libsql://wiratmadja-db-username.turso.io\
=\your_turso_auth_token\

# Push skema tabel Prisma ke database Turso cloud
npx prisma db push
`
*(Atau di Bash/Linux/Mac: TURSO_DATABASE_URL=\...\ TURSO_AUTH_TOKEN=\...\ npx prisma db push)*

### Langkah B: Jalankan Seed Data Awal
`ash
# Populasi kategori, produk awal, dan akun admin/kontributor ke Turso cloud
npx prisma db seed
`

---

## 4. ⚠️ PERINGATAN PENTING: Penggantian Password Akun Default

> 🚨 **KEAMANAN KRITIS:**
> Kredensial default bawaan seed (dmin123 untuk Admin & keluarga123 untuk Kontributor) tersimpan secara publik di kode sumber GitHub (prisma/seed.ts).
> 
> **Setelah deployment pertama selesai:**
> 1. Login ke aplikasi yang sudah live di Vercel (/internal/login).
> 2. Masuk ke halaman **Kelola User** (/internal/users).
> 3. Segera ubah password akun dmin@wiratmadja.id dan keluarga@wiratmadja.id dengan password baru yang kuat & rahasia.

