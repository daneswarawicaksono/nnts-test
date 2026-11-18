import React from 'react';
import { useLocation } from 'wouter';
import { MainLayout } from '../layouts/MainLayout';
import type { AuthSession, UserRole } from '../types/role';

interface RoleGuardProps {
  session: AuthSession | null;
  allowedRole: UserRole;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ session, allowedRole, children }) => {
  const [, setLocation] = useLocation();

  if (!session) {
    // Belum login, alihkan ke welcome
    setTimeout(() => setLocation('/'), 0);
    return null;
  }

  if (session.user.role !== allowedRole) {
    // Role tidak cocok, lempar ke rute default role yang bersangkutan
    const fallback = 
      session.user.role === 'cadre' ? '/cadre/queue' : 
      session.user.role === 'doctor' ? '/doctor/worklist' : '/parent/home';
    
    setTimeout(() => setLocation(fallback), 0);
    return null;
  }

  return <MainLayout session={session}>{children}</MainLayout>;
};
