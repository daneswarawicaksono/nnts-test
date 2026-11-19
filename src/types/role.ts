export type UserRole = 'parent' | 'cadre' | 'doctor';

export interface RegisteredChildData {
  childName: string;
  birthDate: string;
  gender: 'L' | 'P';
  subjectId?: string;
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    fullName: string;
    role: UserRole;
    avatarId: string;
    posyanduId?: string; // For cadre
    faskesId?: string; // For doctor
    childData?: RegisteredChildData; // For parent newly registered child
  };
}
