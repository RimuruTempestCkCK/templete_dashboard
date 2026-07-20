# Starbucks Admin & Store Portal

Aplikasi Web Single Page Application (SPA) modern yang menyajikan **Portal Admin & Manajemen Toko Starbucks**. Aplikasi ini dirancang dengan estetika premium yang terinspirasi oleh sistem desain Starbucks, menampilkan grafik interaktif, panel kontrol admin lengkap, manajemen stok (CRUD), pelacak transaksi, sistem kartu member, dan dukungan penuh untuk tema **Mode Terang & Gelap**.

Aplikasi ini sekarang dikembangkan dengan arsitektur **modular** menggunakan Vite, memisahkan struktur HTML komponen layout dan halaman (views) agar lebih mudah dikelola dan dikembangkan secara terpisah.

---

## 🚀 Fitur Utama

### Core Management & Dashboard
* **Glassmorphism Auth**: Halaman *Login* dan *Register* yang indah, dilengkapi validasi input secara langsung.
* **Dashboard Ringkasan Toko**: Dilengkapi 4 kartu status performa (Pendapatan, Jumlah Pesanan, Member Baru, Kopi Terjual) dengan kurva tren interaktif.
* **Grafik Interaktif (Chart.js)**:
  * Tren Penjualan Mingguan (Area Chart).
  * Proporsi Kategori Terlaris (Doughnut Chart).
  * Penjualan Bulanan Semester 1 (Bar Chart).
  * Jam Puncak Sibuk Transaksi (Line Chart).
* **CRUD Menu Produk**: Pengelolaan menu produk Starbucks secara penuh (Tambah, Edit, Hapus) yang langsung memperbarui tabel secara real-time.
* **Riwayat Transaksi**: Monitor daftar pesanan masuk dari kasir maupun mobile, serta fungsionalitas untuk mengubah status pesanan (*Selesai* atau *Dibatalkan*).
* **Star Members Loyalty**: Manajemen pelanggan, Star Points loyalitas, ID Kartu Member, dan tombol interaktif tambah bintang (+10 Stars) dengan upgrade tingkat (*Welcome*, *Green*, *Gold*).
* **Pengaturan Fleksibel**: Form konfigurasi data profil admin, operasional toko, serta switch toggle notifikasi sistem.

### Store Operations (Fitur Baru)
* **👥 Staf & Shift Barista**: Pengelolaan barista aktif, shift kerja (Pagi, Siang, Malam), pemantauan status kehadiran kerja, rating kinerja kecepatan penyajian, serta penambahan staf baru.
* **📦 Stok & Inventaris Bahan Baku**: Pemantauan inventaris bahan dasar kopi, sirup rasa, susu segar, dan kemasan cup. Dilengkapi grafik persediaan dinamis, fitur restock instan, serta pemesanan otomatis ke supplier jika stok menipis (< 20%).
* **🏷️ Kampanye Promo & Diskon**: Perencanaan promosi seasonal (seperti Double Star Rewards, Happy Hour) beserta pembuatan kode voucher baru dan pengaktifan/penonaktifan voucher secara real-time.

### System & Database
* **Database Persisten**: Menggunakan `localStorage` browser sehingga semua data produk yang ditambah/diedit, status pesanan, stok inventaris, staf, dan bintang member akan tetap tersimpan meski halaman direfresh.
* **Responsif**: Layout adaptif yang mulus diakses lewat layar desktop, tablet, maupun mobile.

---

## 🛠️ Stack Teknologi
* **Core**: HTML5 & Javascript (Vanilla ES6)
* **Styling**: Vanilla CSS3 (Mendukung Custom Properties untuk Light/Dark mode)
* **Build Tool**: Vite (v6) dengan Raw HTML Imports
* **Chart Library**: Chart.js (via CDN)
* **Latar Belakang**: Custom generated high-fidelity asset ([cafe_background.jpg](cafe_background.jpg))

---

## 📂 Struktur Folder Baru (Modular)
```text
templete_dashboard/
├── dist/                  # Folder hasil build untuk produksi (dibuat otomatis)
├── node_modules/          # Dependensi Node.js (dibuat otomatis)
├── cafe_background.jpg    # Gambar latar belakang halaman auth
├── design.md              # Referensi sistem desain Starbucks
├── index.html             # Shell utama aplikasi (Mount Node)
├── package.json           # Konfigurasi dependensi proyek & script runner
├── package-lock.json      # Catatan penguncian versi dependensi
├── README.md              # Panduan dokumentasi proyek (file ini)
├── style.css              # Seluruh styling aplikasi & variabel tema
├── .gitignore             # Pengaturan file yang diabaikan oleh Git
└── src/                   # Source code utama (modular)
    ├── main.js            # Entrypoint utama logika & perakitan komponen
    ├── components/        # Komponen layout terpisah
    │   ├── auth.html      # Form Login & Register
    │   ├── sidebar.html   # Sidebar Menu Navigasi
    │   ├── header.html    # Top Navigation Bar & Live Clock
    │   ├── modal.html     # Backdrop & Popup Modal Dialog
    │   └── toast.html     # Toast Notification Wrapper
    └── pages/             # Konten halaman utama (Views) terpisah
        ├── dashboard.html # Ringkasan Store (Statistik & Grafik)
        ├── menu-manager.html # CRUD Manajemen Menu & Stok
        ├── orders.html    # Riwayat & Status Transaksi
        ├── members.html   # Starbucks Card Star Members
        ├── staff-manager.html # Manajemen Staf Barista & Jadwal Shift
        ├── inventory-manager.html # Inventaris Bahan Baku & Supplier
        ├── promotions.html # Kampanye Promo & Kode Voucher
        ├── analytics.html # Analitik Lanjutan
        └── settings.html  # Pengaturan Sistem Portal
```

---

## ⚡ Cara Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal di komputer Anda:

### 1. Kloning Repositori dari GitHub
Buka terminal/command prompt Anda, lalu jalankan perintah berikut:
```bash
git clone https://github.com/RimuruTempestCkCK/templete_dashboard.git
```

### 2. Pindah ke Direktori Proyek
```bash
cd templete_dashboard
```

### 3. Install Dependensi Proyek
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/). Jalankan perintah berikut untuk menginstal package compiler (Vite):
```bash
npm install
```

### 4. Jalankan Server Development
Jalankan server lokal dengan perintah:
```bash
npm run dev
```

### 5. Buka Aplikasi di Browser
Setelah server berjalan, buka peramban browser Anda dan akses alamat lokal yang tertera di terminal, biasanya:
```text
http://localhost:5173
```

---

## 🔑 Akun Uji Coba Default (Kredensial)
Untuk masuk ke portal admin, gunakan akun administrator bawaan berikut:
* **Email**: `admin@starbucks.co.id`
* **Password**: `admin123`

*Anda juga dapat menggunakan fitur **Daftar akun** langsung di halaman utama untuk membuat akun administrator baru.*

---

## 📄 Hak Cipta & Lisensi
Sistem Templat Dashboard ini dikembangkan oleh **Firdinal Juliandre**.

Hak Cipta © 2026. Seluruh hak cipta dilindungi undang-undang.
