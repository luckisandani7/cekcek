# VectorStock AI - Vector Generator & Adobe Stock Submitter

Aplikasi pembuatan gambar vektor otomatis (SVG & EPS-10) dari teks/prompt dengan generator metadata resmi Adobe Stock Contributor (format CSV) dan dukungan ekspor batch ZIP serta deploy langsung ke **GitHub Pages**.

---

## 🚀 Cara Deploy ke GitHub Pages

Aplikasi ini sudah dikonfigurasi penuh dengan:
- **Alur kerja otomatis GitHub Actions** (`.github/workflows/deploy.yml`)
- **Aset jalur relatif** (`base: './'` di `vite.config.ts`) agar aset CSS & JS tidak 404 pada subpath URL repository
- **Mesin Vektor Client-Side** yang tetap berjalan 100% di peramban tanpa memerlukan server Node.js di GitHub Pages
- **Dukungan Routing SPA** (`public/404.html` dan `public/.nojekyll`)

### Langkah 1: Buat Repository Baru di GitHub
1. Buka [github.com/new](https://github.com/new)
2. Beri nama repository, misalnya `vectorstock-ai`
3. Pilih status repository (Public atau Private)
4. Klik **Create repository**

### Langkah 2: Push Kode ke GitHub
Jalankan perintah berikut di terminal komputer Anda:
```bash
git init
git add .
git commit -m "Deploy VectorStock AI to GitHub Pages"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<NAMA-REPO>.git
git push -u origin main
```
*Jika Anda sudah pernah membuat/mendorong repository sebelumnya, cukup jalankan:*
```bash
git add .
git commit -m "Perbarui alur kerja deploy GitHub Pages"
git push
```

### Langkah 3: Aktifkan GitHub Pages di Repository
1. Buka repository Anda di GitHub.
2. Klik tab **Settings** (Pengaturan).
3. Di panel menu kiri, klik **Pages**.
4. Di bagian **Build and deployment > Source**, pilih opsi **"GitHub Actions"**.
5. Tunggu 1-2 menit hingga proses alur kerja di tab **Actions** selesai.
6. Website Anda akan aktif dan siap digunakan di:
   ```
   https://<username>.github.io/<nama-repo>/
   ```

---

## 🛠️ Perintah Lokal

```bash
# Install dependensi
npm install

# Jalankan server lokal (Express + Vite)
npm run dev

# Build untuk GitHub Pages (file statis di dist/)
npm run build:pages

# Pratinjau hasil build
npm run preview
```

---

## 🎨 Fitur Utama
- **Generator Vektor Otomatis**: Input prompt objek apa pun untuk menghasilkan SVG & EPS-10 secara massal.
- **Adobe Stock Metadata Generator**: Menghasilkan Judul komersial 5-10 kata, 35+ keywords terurut prioritas, dan ID Kategori resmi 1-21.
- **Ekspor CSV 1-Klik**: Kompatibel 100% dengan fitur *Upload CSV* di tab Contributor Adobe Stock.
- **Download Batch ZIP**: Mengompres semua file vektor, pratinjau PNG, CSV, dan panduan teks dalam 1 file ZIP.
- **Integrasi SFTP**: Mendukung pengiriman langsung ke `sftp.contributor.adobestock.com` saat dijalankan dengan backend.
