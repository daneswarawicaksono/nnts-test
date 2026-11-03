# NNTS v2 — Neuro-Nutrient Triage System
> **Frontend Web Application (v2 Rebuild)**  
> Sistem Pendukung Keputusan Klinis (*Clinical Decision Support System* / CDSS) untuk Deteksi Dini Stunting & *Hidden Hunger* (Defisiensi Fe, Zn, Vitamin B12) pada Balita Usia 24–59 Bulan.

---

## 🌟 Fitur Utama

1. **3 Peran Pengguna Terpadu (*Multi-Role Workstation*)**:
   - **Orang Tua**: Pemantauan gizi ramah keluarga, Rapor Tumbuh Kembang langsung di Beranda, Pita Usia KMS Horisontal, Dapur Pangan Lokal Ceria (resep terjangkau kaya mikronutrien), dan berbagi laporan ke WhatsApp.
   - **Kader Posyandu**: Stasiun kerja sesi penimbangan posyandu, indikator pita LiLA dinamis (Merah `<11.5 cm`, Kuning `11.5–12.5 cm`, Hijau `>12.5 cm`), pencatatan tanda fisik (konjungtiva & stomatitis), dan pendaftaran balita baru.
   - **Dokter Puskesmas**: Stasiun kerja klinis laptop dua kolom (*split-pane*), triase rujukan berprioritas tier (*Tier-1 Merah*, *Tier-2 Kuning*, *Normal*), formulir Catatan Intervensi Medis, dan ekspor payload interoperabilitas **SATUSEHAT FHIR R4 Bundle** (`Bundle`, `Patient`, `Observation`, `ClinicalImpression`).

2. **Peta Petualangan Skrining Balita (*Adventure Trail Map*)**:
   - Sesi permainan ramah anak berdurasi singkat (< 5 menit) tanpa jarum suntik (*zero venipuncture*).
   - **Tahap 1: Pulau Balon Kilat** 🎈 (Uji latensi reaksi dopaminergik striatum — Zat Besi).
   - **Tahap 2: Kebun Buah Ceria** 🍎 (Kontrol inhibisi prefrontal Go/No-Go — Seng).
   - **Tahap 3: Lembah Jejak Hewan** 🐰 (Kapasitas memori kerja spasial terbalik — Vitamin B12).
   - **Tahap 4: Puncak Bintang Emas** 🏆 (Piala harta karun & evaluasi algoritma CDSS).

3. **Tata Letak Adaptif Responsif**:
   - **Orang Tua & Sesi Permainan**: Tampilan terpusat ramah ponsel (`max-w-[400px]`).
   - **Dokter & Kader Posyandu**: Melebar otomatis di layar laptop/desktop (`max-w-6xl`) menjadi stasiun kerja profesional tanpa distorsi.

---

## 🚀 Menjalankan Secara Lokal

```bash
# Instal dependensi
npm install

# Jalankan server pengembangan
npm run dev

# Jalankan uji kompilasi dan build produksi
npm run build
```

---

## ☁️ Deployment Cloudflare Pages

Proyek ini telah dikonfigurasi untuk Cloudflare Pages dengan SPA fallback di `public/_redirects`:
```
/*    /index.html   200
```
- **Build command**: `npm run build`
- **Build output directory**: `dist`
