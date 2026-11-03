import type { UserRole } from '../types/role';

export interface TabConfig {
  id: string;
  label: string;
  route: string;
}

export interface RoleThemeConfig {
  ambientGradient: string;
  brandPrimary: string;
  brandAccent: string;
  textHeading: string;
}

export interface RoleConfig {
  role: UserRole;
  displayName: string;
  tagline: string;
  theme: RoleThemeConfig;
  tabs: [TabConfig, TabConfig, TabConfig]; // 3 menu pada bottom segmented rail (Opsi A2)
  inCardActionLabel: string; // In-Card Contextual Action (Opsi B1)
  defaultRoute: string;
  requiresInviteCode: boolean;
}

export const ROLE_CONFIGURATIONS: Record<UserRole, RoleConfig> = {
  parent: {
    role: 'parent',
    displayName: 'Orang Tua',
    tagline: 'Pantau Tumbuh Kembang Buah Hati Tanpa Cemas',
    theme: {
      ambientGradient: 'from-amber-50/70 via-teal-50/50 to-orange-50/60',
      brandPrimary: '#0F766E',
      brandAccent: '#F97316',
      textHeading: 'text-slate-900',
    },
    tabs: [
      { id: 'beranda', label: 'Beranda', route: '/parent/home' },
      { id: 'pita-kms', label: 'Pita KMS', route: '/parent/kms' }, // Opsi C2
      { id: 'dapur', label: 'Dapur Gizi', route: '/parent/nutrition' },
    ],
    inCardActionLabel: 'Mulai Pantau Gizi Hari Ini', // Opsi B1
    defaultRoute: '/parent/home',
    requiresInviteCode: false,
  },

  cadre: {
    role: 'cadre',
    displayName: 'Kader Posyandu',
    tagline: 'Skrining Gizi Komunitas & Deteksi Dini Balita',
    theme: {
      ambientGradient: 'from-emerald-50/70 via-teal-50/50 to-cyan-50/60',
      brandPrimary: '#0F766E',
      brandAccent: '#10B981',
      textHeading: 'text-teal-950',
    },
    tabs: [
      { id: 'antrean', label: 'Antrean', route: '/cadre/queue' },
      { id: 'timbang', label: 'Timbang & Ukur', route: '/cadre/weigh' },
      { id: 'rekap', label: 'Rekap Posyandu', route: '/cadre/recap' },
    ],
    inCardActionLabel: 'Timbang Balita Baru', // Opsi B1
    defaultRoute: '/cadre/queue',
    requiresInviteCode: true,
  },

  doctor: {
    role: 'doctor',
    displayName: 'Dokter / Tenaga Medis',
    tagline: 'Sistem Pendukung Keputusan Klinis (CDSS) FKTP',
    theme: {
      ambientGradient: 'from-slate-50 via-teal-50/30 to-slate-100',
      brandPrimary: '#0F766E',
      brandAccent: '#0D9488',
      textHeading: 'text-slate-900',
    },
    tabs: [
      { id: 'pasien', label: 'Pasien Rujukan', route: '/doctor/worklist' },
      { id: 'analisis', label: 'Analisis CDSS', route: '/doctor/cdss' },
      { id: 'intervensi', label: 'Catatan Intervensi', route: '/doctor/interventions' },
    ],
    inCardActionLabel: 'Tinjau Rujukan Klinis', // Opsi B1
    defaultRoute: '/doctor/worklist',
    requiresInviteCode: true,
  },
};
