---
name: NNTS Design System
description: Clinical-grade pediatric neurodevelopmental triage & screening design language
colors:
  primary: "#0D9488"
  primary-dark: "#0F766E"
  primary-light: "#F0FDF9"
  accent-cognitive: "#4F46E5"
  accent-warm: "#F97316"
  triage-danger: "#EF4444"
  triage-warning: "#F59E0B"
  triage-success: "#10B981"
  lila-red: "#DC2626"
  lila-yellow: "#D97706"
  lila-green: "#059669"
  surface-canvas: "#F8FAFC"
  surface-card: "#FFFFFF"
  surface-child: "#FDF4FF"
  text-primary: "#0F172A"
  text-secondary: "#475569"
  text-muted: "#64748B"
  border-default: "#E2E8F0"
typography:
  display:
    fontFamily: "Nunito, -apple-system, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.2
  display-sm:
    fontFamily: "Nunito, -apple-system, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 800
    lineHeight: 1.2
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
  micro:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.3
  badge:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1.2
  nano:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.5625rem"
    fontWeight: 700
    lineHeight: 1.2
  clinical-metric:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary-dark}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-warm:
    backgroundColor: "{colors.accent-warm}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
---

# NNTS Design Language & Aesthetic Guidelines

## Overview
NNTS (Nusantara Neuro-Developmental Triage & Screening) menggabungkan dua dunia estetika yang harmonis: **Clinical Ergonomics** (presisi, keterbacaan data medis, kejelasan triase) dan **Pediatric Wonder** (hangat, playful, tidak mengintimidasi anak balita). Antarmuka didesain dengan standar kualitas kerajinan tangan tinggi (out-of-distribution craft), bukan estetika template generic AI.

## Colors
Palet dirancang berbasis bukti untuk memenuhi standar kontras WCAG AA (≥ 4.5:1 untuk teks biasa, ≥ 3.0:1 untuk elemen UI grafis):
- **Nutri-Teal (`#0D9488` / `#0F766E`)**: Warna brand utama melambangkan kesehatan, pertumbuhan sel, dan gizi seimbang.
- **Cognitive Indigo (`#4F46E5`)**: Aksen domain kognitif, atensi, dan fungsi eksekutif.
- **Nutrient Orange (`#F97316`)**: Aksen hangat untuk energi, selebrasi bintang, dan streak positif.
- **Clinical Triage**:
  - `Tier-1 Emergency` (`#EF4444`): Perhatian darurat/defisiensi berat dengan label teks dan ikon jelas (bukan hanya warna).
  - `Tier-2 Warning` (`#F59E0B`): Perhatian khusus / borderline.
  - `Normal` (`#10B981`): Status gizi & perkembangan optimal.
- **Pita LiLA WHO**:
  - Merah: `< 11.5 cm` (`#DC2626`)
  - Kuning: `11.5 – 12.5 cm` (`#D97706`)
  - Hijau: `≥ 12.5 cm` (`#059669`)

## Typography
- **Child & Hero Game Displays (`Nunito`)**: Bentuk rounded-sans ramah anak, mudah dibaca balita tanpa sudut tajam yang kaku.
- **Clinical & Professional Body (`Figtree` / `Inter`)**: Sangat jernih pada layar smartphone kader dan desktop dokter, memiliki rasio x-height tinggi untuk keterbacaan optimal di lapangan.
- **Clinical Data & Metrics (`JetBrains Mono`)**: Monospace tabular untuk angka Z-score, lingkar lengan LiLA (cm), latensi reaksi (ms), dan kode diagnosa ICD-10 / LOINC.

## Layout
- **Mobile Frame (Orang Tua & Kader)**: Didesain single-hand friendly dengan kontrol primer di zona ibu jari bawah (bottom 40% layar), safe-area insets untuk notch/home bar, padding konsisten 16–24px.
- **Desktop Workstation (Dokter)**: 2-kolom seimbang (Worklist pasien di kiri dengan sticky status filtering; lembar pemeriksaan, grafik radar kognitif, dan aksi klinis di kanan).
- **Target Sentuh**: Semua tombol dan elemen interaktif memiliki minimum hit area **44×44 px** sesuai panduan WHO Health App & WCAG AA.

## Elevation & Depth
- Menghindari skeuomorphism murah atau drop-shadow berlapis-lapis kotor.
- Menggunakan layer subtil bergradasi ringan (`0 2px 8px rgba(15, 23, 42, 0.04)` hingga `0 8px 24px -4px rgba(15, 118, 110, 0.35)`).
- Card latar putih bersih dengan border halus `border-slate-200/80` atau glass subtle untuk konteks overlay.

## Shapes
- Radius konsisten berjenjang:
  - Pills (`rounded-pill` / `9999px`) untuk tombol utama, chip kategori, dan status badge.
  - Cards (`rounded-2xl` / `20px` - `24px`) untuk wadah konten dan modul layar.
  - Micro-elements (`rounded-lg` / `8px` - `12px`) untuk input field dan kontrol tabular.

## Components
1. **Button**: Menampilkan status loading spinner, ikon visual kiri/kanan, state `:active` dengan scale `0.98` yang halus, dan kontras teks putih tajam pada background solid.
2. **LiLA Tape Meter**: Visualisasi pita warna interaktif real-time langsung di sebelah input numerik kader untuk memverifikasi akurasi pengukuran secara instan.
3. **Mascot Timi / Cakra**: Karakter pendamping empatik dengan 4 ekspresi (calm, happy, curious, celebrating) yang menuntun anak tanpa distraksi berlebihan.
4. **Radar & Rapor Card**: Rapor 3 domain gizi mikro (Zat Besi, Seng, Vitamin B12) yang diterjemahkan menjadi bahasa edukatif bagi orang tua.

## Do's and Don'ts
- **DO**:
  - Pertahankan kontras teks terhadap latar belakang minimal 4.5:1 di semua view.
  - Sertakan teks label atau ikon pendamping di samping warna triage (aksesibel untuk buta warna).
  - Gunakan animasi perlambatan alami (smooth deceleration `cubic-bezier(0.16, 1, 0.3, 1)`).
  - Gunakan ikon SVG (Lucide) berkualitas tinggi untuk setiap aksi dan indikator.
- **DON'T**:
  - DILARANG menggunakan gradien AI ungu-ke-merah muda generik (purple-to-blue / neon-on-dark AI tells).
  - DILARANG menggunakan animasi pantulan memantul (tacky bounce) berlebihan.
  - DILARANG menggunakan raw emoji sebagai ikon tombol aksi interface.
  - DILARANG menampilkan skor numerik merah menakutkan yang dapat menstigma orang tua atau membuat anak cemas.
