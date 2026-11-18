import { coreClient } from './coreClient';

export interface ChildGrowthSummary {
  childId: string;
  childName: string;
  ageMonths: number;
  gender: 'L' | 'P';
  latestWeightKg: number;
  latestHeightCm: number;
  latestMuacCm: number;
  starsEarned: {
    growthStar: boolean;
    reflexStar: boolean;
    focusStar: boolean;
  };
  nutritionAdvice: string[];
}

export const parentApi = {
  /**
   * Mengambil data balita dari akun orang tua yang aktif
   */
  async getChildSummary(childId: string): Promise<ChildGrowthSummary | null> {
    try {
      return await coreClient.request<ChildGrowthSummary>(
        `/api/v1/parent/children/${encodeURIComponent(childId)}/summary`
      );
    } catch {
      return null;
    }
  },

  /**
   * Mengambil riwayat poin KMS digital
   */
  async getKMSRecords(childId: string): Promise<any[]> {
    try {
      return await coreClient.request<any[]>(
        `/api/v1/parent/children/${encodeURIComponent(childId)}/kms`
      );
    } catch {
      return [];
    }
  },
};
