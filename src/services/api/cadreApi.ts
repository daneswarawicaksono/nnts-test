import { coreClient } from './coreClient';

export interface ToddlerRecord {
  id: string;
  name: string;
  ageMonths: number;
  gender: 'L' | 'P';
  parentName: string;
  weightKg: number;
  heightCm: number;
  muacCm: number;
  hasMeasuredToday: boolean;
  alert: boolean;
  alertReason?: string;
}

export interface MeasurementPayload {
  toddlerId: string;
  weightKg: number;
  heightCm: number;
  muacCm: number;
  notes?: string;
}

export const cadreApi = {
  /**
   * Mengambil daftar balita di posyandu penugasan
   */
  async getQueue(posyanduId: string = 'POSYANDU-MLT-01'): Promise<ToddlerRecord[]> {
    try {
      const data = await coreClient.request<{ toddlers: ToddlerRecord[] }>(
        `/api/v1/posyandu/${encodeURIComponent(posyanduId)}/queue`
      );
      return data.toddlers;
    } catch {
      // Fallback cache lokal jika offline
      const cached = localStorage.getItem(`nnts_cadre_queue_${posyanduId}`);
      if (cached) {
        return JSON.parse(cached);
      }
      return [];
    }
  },

  /**
   * Simpan pengukuran antropometri balita
   */
  async recordMeasurement(payload: MeasurementPayload): Promise<boolean> {
    try {
      await coreClient.request('/api/v1/posyandu/measurements', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return true;
    } catch {
      // Jika jaringan gagal, simpan di offline vault
      coreClient.queueOfflineRecord({
        type: 'CADRE_MEASUREMENT',
        timestamp: new Date().toISOString(),
        payload,
      });
      return false;
    }
  },

  /**
   * Mendaftarkan balita baru ke Posyandu
   */
  async registerToddler(toddler: Omit<ToddlerRecord, 'id' | 'hasMeasuredToday' | 'alert'>): Promise<ToddlerRecord> {
    return await coreClient.request<ToddlerRecord>('/api/v1/posyandu/toddlers', {
      method: 'POST',
      body: JSON.stringify(toddler),
    });
  },
};
