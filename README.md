# Neuro-Nutrient Triage System (NNTS)
### Smart Clinical Decision Support System (CDSS) for Pediatric Hidden Hunger Screening in Primary Healthcare (Puskesmas & Posyandu)

---

## Ringkasan Sistem (System Overview)
**Neuro-Nutrient Triage System (NNTS)** adalah prototipe sistem pendukung keputusan klinis (*Clinical Decision Support System / CDSS*) berbasis web untuk mendeteksi dini defisiensi mikronutrien subklinis (*hidden hunger*): **Zat Besi (Fe)**, **Seng (Zn)**, dan **Vitamin B12** pada anak usia 24–59 bulan di tingkat pelayanan primer (Posyandu & Puskesmas FKTP) tanpa trauma jarum suntik (*zero venipuncture*).

Sistem ini memadukan:
1. **Skrining Neurokognitif Tergamifikasi (<5 Menit)**:
   - *Reaction Time Test* (latensi respons dopaminergik basal & defisiensi besi laten).
   - *Go/No-Go Test* (kontrol inhibisi & atensi prefrontal).
   - *Symbol Span Backward Test* (memori kerja hipokampus terasosiasi defisiensi seng dan B12).
2. **Kalibrasi Somatometri Sekunder**:
   - Lingkar Lengan Atas (LiLA / MUAC) pita WHO.
   - Berat Badan / Usia (WAZ), Tinggi Badan / Usia (HAZ), Berat Badan / Tinggi Badan (WHZ).
3. **Probabilistik Bayesian CDSS**:
   - Inferensi probabilistik untuk mengidentifikasi anak yang tampak sehat di KMS (*KMS Hijau*) namun mengalami penurunan cadangan besi fungsional otak (*subclinical iron deficiency*).

---

## 3 Mode Antarmuka Khusus (Role-Differentiated Interfaces)

Aplikasi dibangun dari **1 sumber data rekam medis tunggal (*Single Source of Truth*)**, namun dirender secara radikal berbeda sesuai kebutuhan tiga kelompok pengguna:

### 1. Mode Skrining Anak (Tablet Posyandu)
- **100% Bebas Data Klinis**: Tidak ada angka medis atau istilah penyakit yang terlihat oleh anak.
- **Visual Petualangan Kartun**: Latar perbukitan *parallax 2 layer*, awan melayang, dan matahari terbit.
- **Maskot Burung Cakra**: Animasi *idle bob*, kedipan mata (*eye blink*), serta variasi gestur berpikir (*curious thinking*) dan selebrasi.
- **Peta Jalur 5 Pulau**: Stiker orisinal berlisensi (*Pondok Cakra, Pulau Balon, Kebun Buah, Lembah Hewan, dan Peti Harta Piala Juara*).
- **Komponen Game Taktil**: Tombol 3D bertepi miring (*bevel*) dan papan kayu panel Kenney UI Pack.
- **Drawer Kader Posyandu**: Panel *slide-over* tersembunyi bagi kader untuk memasukkan data LiLA, BB, dan TB.

### 2. Dasbor Klinis (Dokter Puskesmas & Petugas Gizi FKTP)
- **100% Light Mode Medis**: Tampilan bersih tanpa dark mode untuk kenyamanan klinisi di fasilitas kesehatan primer.
- **Arsitektur 2 Level (EHR Worklist Pattern)**:
  - **Level 1 (Antrean Pasien / Worklist)**: Menampilkan seluruh antrean anak hari ini dengan pencarian NIK/Nama, filter Posyandu, filter status Tier, dan sortir otomatis (*Tier-1 Merah Teratas*).
  - **Level 2 (Detail Rekam Medis Pasien)**: Dibuka setelah memilih pasien, dilengkapi tombol rekam medis `[← Kembali ke Daftar Pasien (Antrean Worklist)]`.
- **Fitur Klinis Tingkat Lanjut**:
  - *Alert Box 1 Baris*: 1 kalimat kesimpulan langsung + 1 tombol aksi preskripsi, rincian teknis tersimpan di *accordion collapsible*.
  - *Spider Radar Chart 3 Sumbu*: Risiko Zat Besi, Seng, dan Vitamin B12.
  - *Checklist Konfirmasi Fisik Dokter (HITL)*: Konjungtiva, kelelahan postural, diet protein hewani, infeksi akut.
  - *Modul Preskripsi Standar Kemenkes*: Sirup Besi, Suplemen Seng, Bubuk Taburia MNP, Konseling PMBA.
  - *Tabel Rujukan WHO Z-Score & Pelacak Pemulihan 4 Pekan*.
  - *Ekspor Interoperabilitas*: HL7 FHIR R4 & openEHR sanitized JSON bundle.

### 3. Laporan Keluarga (Orang Tua)
- **Format Album Buku Cerita (*Storybook Parchment Album*)**:
  - Kertas bersudut lengkung hangat (`#FFFDF7`), pita pembatas buku merah, dan stempel ramah Posyandu.
  - Avatar anak dinamis DiceBear API berdasarkan nama anak.
  - 3 Medali Kekuatan Bermain anak (Refleks Kilat, Fokus Teliti, Ingatan Hebat).
  - Kurva Jalur Sungai Sehat (*Green Healthy River Chart*).
  - Catatan Dapur Ceria Ibu & Ide Main 10 Menit dengan ilustrasi mangkuk nutrisi Storyset.
  - **Tiket Paspor Petualangan Posyandu (*Boarding Pass Style*)**: Jadwal kunjungan 28 hari berikutnya dengan tata letak responsif anti-overflow dan ilustrasi dokter anak Storyset.

---

## Daftar Sumber Daya & Lisensi Aset (Asset Licensing & Attribution Registry)

Seluruh aset grafis, ikon, dan komponen dalam NNTS menggunakan aset orisinal berlisensi bebas yang dicatat secara resmi:

| Aset / Komponen | Sumber Penyedia | Lisensi | Penggunaan dalam Aplikasi |
| :--- | :--- | :--- | :--- |
| **Ilustrasi Medis & Makanan** | [Storyset by Freepik](https://storyset.com/) | **Freepik License** (Free with attribution) | Ilustrasi Mangkuk Nutrisi Sehat (*Catatan Dapur Ceria*) dan Ilustrasi Dokter Anak (*Tiket Posyandu*) |
| **Avatar Anak Dinamis** | [DiceBear Adventurer API](https://www.dicebear.com/) (Lisa Wischofsky) | **CC BY 4.0** | Avatar ekspresif anak pada Worklist Level 1, Header Pasien Level 2, Sampul Album Keluarga, dan Kartu Buku KIA |
| **Stiker Node Peta Jalur** | [Microsoft Fluent Emoji Flat](https://github.com/microsoft/fluentui-emoji) via Iconify | **MIT License** | Stiker Pulau Petualangan: Rumah (*Pondok*), Balon, Pohon Buah (*Kebun*), Kucing (*Lembah Hewan*), Piala (*Pesta Juara*) |
| **Peti Harta Karun** | [OpenMoji](https://openmoji.org/) | **CC BY-SA 4.0** | Vektor peti harta karun petualangan anak |
| **Komponen UI Game Taktil** | [Kenney UI Pack](https://kenney.nl/assets/ui-pack) | **CC0 1.0 Universal** (Public Domain) | Tombol 3D bertepi miring (*bevel buttons*), panel kayu berbingkai rivet, dan pita dialog |
| **Ikon Antarmuka Sistem** | [Lucide Icons](https://lucide.dev/) | **ISC License** | Seluruh ikon chrome klinis, navigasi, dan indikator medis |
| **Efek Suara Sintesis** | Web Audio API Oscillator Synth | **MIT License (Custom)** | Efek suara interaktif (*pop, chime, fanfare, click*) tanpa file audio eksternal berat |

---

## Panduan Menjalankan Aplikasi (Development & Build)

### Prasyarat
- Node.js versi 18 atau lebih baru.
- npm atau pnpm.

### Instalasi & Menjalankan Server Lokal
```bash
# Masuk ke direktori proyek
cd nnts-web

# Jalankan server pengembangan lokal (Vite)
npm run dev

# Buka di peramban
http://localhost:5173/
```

### Membangun Versi Produksi (*Production Build*)
```bash
npm run build
```
Hasil build yang teroptimasi akan berada di folder `dist/`.

---

## Pengembang & Penafian Medis
- **Program Percontohan**: Kemenkes RI Posyandu & Puskesmas FKTP Pilot Program.
- **Penafian (*Medical Disclaimer*)**: NNTS adalah sistem penunjang keputusan (*Clinical Decision Support*). Keputusan diagnosis definitif dan pemberian terapi farmakologis mutlak berada di bawah wewenang dokter dan tenaga gizi klinis berwenang di fasilitas kesehatan.
