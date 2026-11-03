export interface RegionEntity {
  provinceId: string;
  provinceName: string;
  regencyId: string;
  regencyName: string;
  districtId: string;
  districtName: string;
  villageId: string;
  villageName: string;
}

export interface PosyanduEntity {
  id: string; // e.g. "POSYANDU-MLT-01"
  name: string; // e.g. "Posyandu Melati 1"
  rwCode: string;
  puskesmasId: string;
  villageName: string;
}

export interface FaskesEntity {
  id: string; // e.g. "PUSK-TEGALREJO"
  name: string; // e.g. "Puskesmas Tegalrejo"
  type: 'puskesmas' | 'klinik' | 'rsud';
  districtName: string;
}
