import React from 'react';
import { useLocation, Link } from 'wouter';
import { ROLE_CONFIGURATIONS } from '../config/roleConfig';
import type { UserRole } from '../types/role';

interface BottomNavProps {
  role: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({ role }) => {
  const [location] = useLocation();
  const config = ROLE_CONFIGURATIONS[role];

  if (!config) return null;

  return (
    <nav className="shrink-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around z-30 shadow-sm">
      {config.tabs.map((tab) => {
        const isActive = location === tab.route;

        return (
          <Link
            key={tab.id}
            href={tab.route}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${
              isActive
                ? 'text-teal-800 font-extrabold bg-teal-50/80'
                : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <span className="text-xs tracking-tight">{tab.label}</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-teal-700 mt-0.5 animate-pulse" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
