// ============================================================
// Utilitas Klinis — Perhitungan Umur Balita (Bulan Kalender Penuh)
// NNTS Frontend — Selaras dengan Kontrak Backend nnts-api
// ============================================================

/**
 * Menghitung umur balita dalam bulan kalender penuh.
 *
 * Formula:
 *   months = (tahunAt - tahunLahir) * 12 + (bulanAt - bulanLahir)
 *   kurangi 1 jika hariAt < hariLahir
 *   hasil minimal 0
 *
 * Konvensi 29 Februari (Tahun Kabisat):
 * Jika lahir pada 29 Februari dan dievaluasi pada tahun non-kabisat (Februari hanya 28 hari),
 * hari evaluasi 28 Februari belum genap 1 bulan (hariAt < hariLahir: 28 < 29),
 * dan genap bertambah 1 bulan pada 1 Maret.
 *
 * @param birthDateISO Tanggal lahir format string ISO (YYYY-MM-DD atau full ISO)
 * @param atISO Tanggal evaluasi format string ISO (YYYY-MM-DD atau full ISO)
 * @returns Umur dalam bulan kalender penuh (integer >= 0)
 */
export function ageInMonths(birthDateISO: string, atISO: string): number {
  if (!birthDateISO || !atISO) {
    return 0;
  }

  const birthDatePart = birthDateISO.split('T')[0];
  const atDatePart = atISO.split('T')[0];

  const [bYear, bMonth, bDay] = birthDatePart.split('-').map(Number);
  const [aYear, aMonth, aDay] = atDatePart.split('-').map(Number);

  if (!bYear || !bMonth || !bDay || !aYear || !aMonth || !aDay) {
    return 0;
  }

  let months = (aYear - bYear) * 12 + (aMonth - bMonth);
  if (aDay < bDay) {
    months -= 1;
  }

  return Math.max(0, months);
}
