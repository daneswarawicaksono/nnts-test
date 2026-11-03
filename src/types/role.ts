export type UserRole = 'parent' | 'cadre' | 'doctor';

export interface AuthSession {
  token: string;
  user: {
    id: string;
    fullName: string;
    role: UserRole;
    avatarId: string;
    posyanduId?: string; // For cadre
    faskesId?: string; // For doctor
  };
}
