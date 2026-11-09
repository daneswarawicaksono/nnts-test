# Product

<!-- impeccable:product-schema 1 -->

## Purpose & Vision
NNTS (Nusantara Neuro-Developmental Triage & Screening) adalah platform skrining dan triase tumbuh kembang serta defisiensi mikronutrien (Zat Besi/Fe, Seng/Zn, Vitamin B12) berbasis web untuk anak usia 24–59 bulan di Indonesia. Sistem ini menghubungkan kader Posyandu, orang tua, dan dokter Puskesmas melalui instrumen gamifikasi neurokognitif digital yang divalidasi secara klinis.

## Users & Roles
- **Orang Tua**: Memantau rapor gizi mikro, status tumbuh kembang anak, rekomendasi makanan lokal kaya nutrisi, dan edukasi pencegahan stunting.
- **Kader Posyandu**: Melakukan pencatatan antropometri (BB, TB, LiLA dengan pita warna visual real-time), memandu anak dalam sesi skrining gamifikasi 5–7 menit.
- **Dokter Puskesmas / Dokter Anak**: Workstation klinis 2-kolom untuk evaluasi worklist pasien berbasis triase prioritas (Tier-1 Merah, Tier-2 Kuning, Hijau Normal), analisis radar kognitif, rencana intervensi nutrisi, dan ekspor standar FHIR R4 ke SATUSEHAT Kemenkes RI.

## Primary Workflows
1. **Pendaftaran & Antropometri**: Kader memasukkan data balita, pita LiLA terdeteksi otomatis (Merah <11.5 cm, Kuning 11.5–12.5 cm, Hijau >=12.5 cm).
2. **Skrining Petualangan Cakra (5 Modul Gamifikasi)**:
   - *Pondok Cakra*: Kalibrasi input sentuh & kesiapan anak.
   - *Pulau Balon Kilat*: Simple reaction time (visuomotor speed).
   - *Kebun Buah Ajaib*: Go/No-Go inhibition (executive control & zinc deficiency markers).
   - *Lembah Hewan*: Reverse digit/sequence memory span (working memory & iron/B12 markers).
   - *Puncak Emas*: Selebrasi capaian, feedback positif tanpa stigma skor angka langsung pada anak.
3. **Triase & Workstation Klinis**: Dokter meninjau worklist terurut urgensi, menetapkan intervensi, dan mengekspor dokumen rekam medis standar interoperabilitas.

## Platform & Constraints
- **Platform**: Web (Mobile-first responsif untuk smartphone Orang Tua & Kader; Desktop 2-column workstation untuk Dokter).
- **Aksesibilitas**: WCAG 2.1 AA (kontras teks minimum 4.5:1, target sentuh minimum 44×44 px sesuai pedoman WHO Health App).
- **Off-line Resilience**: Bekerja mulus pada koneksi lambat 3G/EDGE di daerah 3T.
- **Ergonomi**: Bahasa ramah anak, bebas dari visual menakutkan atau stigmatisasi diagnosa stunting di depan anak.
