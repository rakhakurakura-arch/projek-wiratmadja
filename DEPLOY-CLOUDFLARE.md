# Panduan Deploy Proyek WIRATMADJA ke Cloudflare Workers

Panduan ini berisi langkah-langkah men-deploy aplikasi katalog **WIRATMADJA** ke **Cloudflare Workers** menggunakan adapter resmi @opennextjs/cloudflare dan database cloud **Turso**.

---

## 1. Persiapan & Otentikasi Cloudflare CLI (Wrangler)

Sebelum melakukan deploy, pastikan Anda telah memiliki akun Cloudflare dan sudah login melalui Wrangler CLI:

`ash
# Login ke akun Cloudflare via browser
npx wrangler login
`

---

## 2. Pengaturan Secret / Environment Variables di Cloudflare

Untuk menjaga keamanan kredensial sensitif, gunakan wrangler secret put alih-alih menyimpannya secara plaintext di file wrangler.jsonc:

`ash
# 1. Secret URL Database Turso
npx wrangler secret put TURSO_DATABASE_URL
# Masukkan nilai: libsql://wiratmadja-db-username.turso.io

# 2. Secret Auth Token Turso
npx wrangler secret put TURSO_AUTH_TOKEN
# Masukkan nilai: token_turso_anda

# 3. Secret JWT untuk Sesi Login Admin
npx wrangler secret put JWT_SECRET
# Masukkan nilai: string_acak_panjang_dan_aman_baru
`

---

## 3. ⚠️ PENTING: Variabel NEXT_PUBLIC_WHATSAPP_NUMBER Saat Build

Variabel yang berawalan NEXT_PUBLIC_ (seperti NEXT_PUBLIC_WHATSAPP_NUMBER) akan **di-inject ke dalam kode JavaScript klien saat proses BUILD**, bukan saat runtime request masuk.

Oleh karena itu, saat melakukan deploy di CI/CD atau terminal lokal, pastikan NEXT_PUBLIC_WHATSAPP_NUMBER sudah diset di environment sebelum menjalankan perintah build/deploy:

### Di Terminal Lokal (PowerShell Windows):
`powershell
= 6281234567890
npm run deploy
`

### Di Terminal Lokal (Bash / Mac / Linux):
`ash
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890 npm run deploy
`

---

## 4. Perintah Preview & Deploy

### Perintah Preview Lokal (Simulation Workers):
`ash
npm run preview
`

### Perintah Deploy ke Cloudflare Production:
`ash
npm run deploy
`

---

## 5. Migrasi & Seeding Database Turso Pertama Kali

Pastikan skema database Turso sudah di-push dan di-seed sebelum aplikasi diakses pengguna:

`ash
# Push skema tabel ke Turso
=libsql://wiratmadja-db-username.turso.io
=your_turso_token
npx prisma db push

# Seed data awal (kategori, produk, user default)
npx prisma db seed
`

---

## 6. 🚨 PERINGATAN KEAMANAN KRITIS

> **WAJIB GANTI PASSWORD DEFAULT:**
> Akun admin default (dmin@wiratmadja.id / dmin123) dan kontributor (keluarga@wiratmadja.id / keluarga123) ada di kode sumber publik ([prisma/seed.ts](file:///c:/Users/finaw/Downloads/PROJEK%20WIRATMADJA/prisma/seed.ts)).
> 
> **Segera setelah deploy pertama:**
> 1. Buka aplikasi di domain Cloudflare Workers Anda.
> 2. Login ke /internal/login.
> 3. Masuk ke menu **Kelola User** (/internal/users).
> 4. Ubah password kedua akun tersebut dengan password baru yang kuat & rahasia.

