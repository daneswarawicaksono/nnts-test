import type { PatientRecord } from '../types';

export const PRESET_SCENARIOS: Record<string, PatientRecord> = {
  kasus1: {
    id: "ID-FKTP-BLT-042",
    name: "Anisa Putri",
    ageMonths: 48,
    gender: 'P',
    posyandu: "Posyandu Melati 03",
    examDate: "2026-09-18",
    
    // Somatometri: KMS Hijau
    muac: 13.8,
    weight: 15.4,
    height: 101.5,
    waz: 0.1,
    haz: -0.2,
    whz: 0.2,

    // Kognitif: Latensi lambat (>480ms)
    reactionTime: {
      trials: [520, 495, 540, 510, 485],
      avgLatency: 510,
      variance: 420,
      completed: true,
    },
    goNoGo: {
      totalRounds: 10,
      accuracyRate: 60,
      commissionErrors: 3,
      omissionErrors: 1,
      completed: true,
    },
    memorySpan: {
      spanScore: 3,
      sequenceLengthTested: 4,
      completed: true,
    },

    feDeficiencyRisk: 88,
    znDeficiencyRisk: 30,
    b12DeficiencyRisk: 25,
    tierAlert: 'Tier-1 Alert (Merah)',
    clinicalRationale: [
      "Suspek Latent Iron Deficiency: KMS Hijau menyamarkan penurunan cadangan besi fungsional otak.",
      "Latensi motorik memanjang signifikan (510 ms vs normal 350–420 ms) mengindikasikan hendaya dopaminergik basal.",
      "Akurasi Go/No-Go 60% dengan 3 error komisi mengindikasikan penurunan kontrol inhibisi prefrontal."
    ],
    familyStatus: 'Perlu Kunjungan Lanjutan',

    checklist: {
      paleConjunctiva: false,
      posturalFatigue: true,
      lowAnimalProteinDiet: true,
      noAcuteInfection: true,
    },

    prescriptions: {
      ironSyrup: true,
      zincSupplement: false,
      taburiaMNP: true,
      localDietCounseling: true,
      customNotes: "Berikan Sirup Besi Elemental 3 mg/kgBB/hari selama 6 minggu. Evaluasi ulang latensi motorik setelah 4 minggu.",
      isPrescribed: false,
    },

    followUpWindowWeeks: "4–6 Minggu",
    historicTrend: [
      { week: "M-0 (Awal)", latency: 510, normalBaseline: 380 },
      { week: "M-2 (Proyeksi)", latency: 450, normalBaseline: 380 },
      { week: "M-4 (Target)", latency: 395, normalBaseline: 380 },
      { week: "M-6 (Stabil)", latency: 375, normalBaseline: 380 },
    ],
  },

  kasus2: {
    id: "ID-FKTP-BLT-089",
    name: "Budi Santoso",
    ageMonths: 36,
    gender: 'L',
    posyandu: "Posyandu Anggrek 01",
    examDate: "2026-09-17",

    muac: 11.8, // Ambang kuning
    weight: 11.2,
    height: 89.0,
    waz: -1.6,
    haz: -1.8,
    whz: -1.4,

    reactionTime: {
      trials: [430, 445, 410, 460, 425],
      avgLatency: 434,
      variance: 310,
      completed: true,
    },
    goNoGo: {
      totalRounds: 10,
      accuracyRate: 70,
      commissionErrors: 2,
      omissionErrors: 1,
      completed: true,
    },
    memorySpan: {
      spanScore: 2, // Rendah
      sequenceLengthTested: 3,
      completed: true,
    },

    feDeficiencyRisk: 35,
    znDeficiencyRisk: 86,
    b12DeficiencyRisk: 84,
    tierAlert: 'Tier-1 Alert (Merah)',
    clinicalRationale: [
      "Ko-Defisiensi Seng (Zn) & Vitamin B12: LiLA 11.8 cm beriringan dengan hendaya memori kerja hipokampus berat (Span ≤2).",
      "Seng esensial bagi regulasi neurogenesis CA3 hipokampus dan transmisi sinaptik.",
      "Defisit B12 menghambat sintesis mielin aksonal dan sintesis neurotransmiter kognitif."
    ],
    familyStatus: 'Perlu Kunjungan Lanjutan',

    checklist: {
      paleConjunctiva: true,
      posturalFatigue: true,
      lowAnimalProteinDiet: true,
      noAcuteInfection: true,
    },

    prescriptions: {
      ironSyrup: false,
      zincSupplement: true,
      taburiaMNP: true,
      localDietCounseling: true,
      customNotes: "Resepkan Tablet Seng 20 mg/hari (14 hari) dilanjutkan suplementasi MNP kaya B12 serta edukasi MP-ASI telur & hati ayam.",
      isPrescribed: false,
    },

    followUpWindowWeeks: "4–6 Minggu",
    historicTrend: [
      { week: "M-0 (Awal)", latency: 434, normalBaseline: 390 },
      { week: "M-2 (Proyeksi)", latency: 410, normalBaseline: 390 },
      { week: "M-4 (Target)", latency: 392, normalBaseline: 390 },
      { week: "M-6 (Stabil)", latency: 385, normalBaseline: 390 },
    ],
  },

  kasus3: {
    id: "ID-FKTP-BLT-104",
    name: "Citra Lestari",
    ageMonths: 54,
    gender: 'P',
    posyandu: "Posyandu Cempaka 02",
    examDate: "2026-09-19",

    muac: 14.5, // Hijau
    weight: 17.2,
    height: 107.0,
    waz: 0.4,
    haz: 0.3,
    whz: 0.3,

    reactionTime: {
      trials: [360, 375, 350, 390, 365],
      avgLatency: 368,
      variance: 180,
      completed: true,
    },
    goNoGo: {
      totalRounds: 10,
      accuracyRate: 90,
      commissionErrors: 1,
      omissionErrors: 0,
      completed: true,
    },
    memorySpan: {
      spanScore: 4,
      sequenceLengthTested: 4,
      completed: true,
    },

    feDeficiencyRisk: 12,
    znDeficiencyRisk: 10,
    b12DeficiencyRisk: 8,
    tierAlert: 'Normal (Hijau)',
    clinicalRationale: [
      "Profil Normonutrisi Seimbang: Pertumbuhan somatik dan neurokognisi dalam batas optimal (±1 SD).",
      "Transmisi motorik cepat (368 ms), kontrol atensi tajam (akurasi 90%), dan rentang memori kerja sangat baik (Span 4).",
      "Tidak ada indikasi defisiensi mikronutrien mikro atau makro."
    ],
    familyStatus: 'Tumbuh Kembang Baik',

    checklist: {
      paleConjunctiva: false,
      posturalFatigue: false,
      lowAnimalProteinDiet: false,
      noAcuteInfection: true,
    },

    prescriptions: {
      ironSyrup: false,
      zincSupplement: false,
      taburiaMNP: false,
      localDietCounseling: true,
      customNotes: "Pertahankan pola asuh gizi seimbang lokal. Kunjungan Posyandu rutin bulan berikutnya untuk pemantauan tumbuh kembang berkala.",
      isPrescribed: false,
    },

    followUpWindowWeeks: "4–6 Minggu",
    historicTrend: [
      { week: "M-0 (Awal)", latency: 368, normalBaseline: 370 },
      { week: "M-2 (Historis)", latency: 372, normalBaseline: 370 },
      { week: "M-4 (Historis)", latency: 365, normalBaseline: 370 },
      { week: "M-6 (Terkini)", latency: 368, normalBaseline: 370 },
    ],
  },

  kasus4: {
    id: "ID-FKTP-BLT-115",
    name: "Daffa Pratama",
    ageMonths: 42,
    gender: 'L',
    posyandu: "Posyandu Melati 03",
    examDate: "2026-09-19",

    muac: 11.2, // Merah (<11.5 cm)
    weight: 10.8,
    height: 90.5,
    waz: -2.3,
    haz: -2.1,
    whz: -2.2,

    reactionTime: {
      trials: [540, 520, 560, 510, 535],
      avgLatency: 533,
      variance: 450,
      completed: true,
    },
    goNoGo: {
      totalRounds: 10,
      accuracyRate: 50,
      commissionErrors: 4,
      omissionErrors: 1,
      completed: true,
    },
    memorySpan: {
      spanScore: 2,
      sequenceLengthTested: 3,
      completed: true,
    },

    feDeficiencyRisk: 94,
    znDeficiencyRisk: 92,
    b12DeficiencyRisk: 90,
    tierAlert: 'Tier-1 Alert (Merah)',
    clinicalRationale: [
      "Defisit Kompleks (Makronutrisi + Multi-Mikronutrisi): Gizi buruk somatik (LiLA 11.2 cm) beriringan dengan hendaya seluruh parameter kognitif.",
      "Memerlukan tata laksana komprehensif PMT pemulihan dan suplementasi terapeutik."
    ],
    familyStatus: 'Perlu Kunjungan Lanjutan',

    checklist: {
      paleConjunctiva: true,
      posturalFatigue: true,
      lowAnimalProteinDiet: true,
      noAcuteInfection: false,
    },

    prescriptions: {
      ironSyrup: true,
      zincSupplement: true,
      taburiaMNP: true,
      localDietCounseling: true,
      customNotes: "Rujuk ke poli gizi klinis untuk pemberian F-75/F-100 dan suplementasi multivitamin dosis terapeutik.",
      isPrescribed: false,
    },

    followUpWindowWeeks: "2–4 Minggu",
    historicTrend: [
      { week: "M-0 (Awal)", latency: 533, normalBaseline: 385 },
      { week: "M-2 (Proyeksi)", latency: 480, normalBaseline: 385 },
      { week: "M-4 (Target)", latency: 420, normalBaseline: 385 },
    ],
  },

  kasus5: {
    id: "ID-FKTP-BLT-128",
    name: "Eka Rahmawati",
    ageMonths: 30,
    gender: 'P',
    posyandu: "Posyandu Anggrek 01",
    examDate: "2026-09-18",

    muac: 12.2, // Kuning
    weight: 10.1,
    height: 84.0,
    waz: -1.3,
    haz: -1.4,
    whz: -1.1,

    reactionTime: {
      trials: [440, 455, 430, 460, 445],
      avgLatency: 446,
      variance: 220,
      completed: true,
    },
    goNoGo: {
      totalRounds: 10,
      accuracyRate: 70,
      commissionErrors: 2,
      omissionErrors: 1,
      completed: true,
    },
    memorySpan: {
      spanScore: 2,
      sequenceLengthTested: 3,
      completed: true,
    },

    feDeficiencyRisk: 55,
    znDeficiencyRisk: 68,
    b12DeficiencyRisk: 72,
    tierAlert: 'Tier-2 Alert (Kuning)',
    clinicalRationale: [
      "Ambang Batas Waspada Mikronutrien: Memori kerja hipokampus menurun dengan LiLA 12.2 cm.",
      "Intervensi dini pangan hewani efektif mencegah perburukan menjadi wasting."
    ],
    familyStatus: 'Perlu Sedikit Perhatian',

    checklist: {
      paleConjunctiva: false,
      posturalFatigue: true,
      lowAnimalProteinDiet: true,
      noAcuteInfection: true,
    },

    prescriptions: {
      ironSyrup: false,
      zincSupplement: true,
      taburiaMNP: true,
      localDietCounseling: true,
      customNotes: "Berikan edukasi modifikasi MP-ASI kaya hati ayam dan kuning telur. Jadwalkan kontrol 4 minggu.",
      isPrescribed: false,
    },

    followUpWindowWeeks: "4 Minggu",
    historicTrend: [
      { week: "M-0 (Awal)", latency: 446, normalBaseline: 395 },
      { week: "M-2 (Proyeksi)", latency: 420, normalBaseline: 395 },
      { week: "M-4 (Target)", latency: 400, normalBaseline: 395 },
    ],
  },

  kasus6: {
    id: "ID-FKTP-BLT-140",
    name: "Farhan Alamsyah",
    ageMonths: 48,
    gender: 'L',
    posyandu: "Posyandu Cempaka 02",
    examDate: "2026-09-17",

    muac: 14.1,
    weight: 16.0,
    height: 102.0,
    waz: 0.2,
    haz: 0.1,
    whz: 0.2,

    reactionTime: {
      trials: [380, 395, 370, 400, 385],
      avgLatency: 386,
      variance: 160,
      completed: true,
    },
    goNoGo: {
      totalRounds: 10,
      accuracyRate: 80,
      commissionErrors: 1,
      omissionErrors: 1,
      completed: true,
    },
    memorySpan: {
      spanScore: 3,
      sequenceLengthTested: 4,
      completed: true,
    },

    feDeficiencyRisk: 18,
    znDeficiencyRisk: 15,
    b12DeficiencyRisk: 12,
    tierAlert: 'Normal (Hijau)',
    clinicalRationale: [
      "Pertumbuhan Somatik & Kognisi Sesuai Usia: Respons refleks motorik dan fokus dalam rentang normal."
    ],
    familyStatus: 'Tumbuh Kembang Baik',

    checklist: {
      paleConjunctiva: false,
      posturalFatigue: false,
      lowAnimalProteinDiet: false,
      noAcuteInfection: true,
    },

    prescriptions: {
      ironSyrup: false,
      zincSupplement: false,
      taburiaMNP: false,
      localDietCounseling: true,
      customNotes: "Pertahankan gizi seimbang. Kontrol rutin penimbangan di Posyandu bulan berikutnya.",
      isPrescribed: false,
    },

    followUpWindowWeeks: "4 Minggu",
    historicTrend: [
      { week: "M-0 (Awal)", latency: 386, normalBaseline: 380 },
      { week: "M-4 (Historis)", latency: 382, normalBaseline: 380 },
    ],
  },
};

export const ALL_PATIENTS_LIST: PatientRecord[] = Object.values(PRESET_SCENARIOS);
