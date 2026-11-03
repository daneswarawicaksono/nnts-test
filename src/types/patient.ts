export type Gender = 'L' | 'P';

export interface ChildProfile {
  id: string;
  parentId: string; // owner_id
  posyanduId: string;
  fullName: string;
  nickname: string;
  birthDate: string; // ISO Date YYYY-MM-DD
  gender: Gender;
  avatarId: string;
}

export interface SomatometricData {
  recordedAt: string;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  muacCm: number; // LiLA pita WHO
  waz: number; // Weight-for-Age
  haz: number; // Height-for-Age
  whz: number; // Weight-for-Height
}
