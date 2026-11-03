import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'tinted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6',
  };

  const variantStyles = {
    default: 'glass-card shadow-card rounded-xl text-slate-900',
    interactive:
      'glass-card shadow-card rounded-xl text-slate-900 cursor-pointer transition-all duration-fast ease-spring-smooth hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]',
    tinted:
      'glass-card shadow-card rounded-xl text-slate-900 bg-nutri-teal-50/50 border-nutri-teal-100/60',
  };

  return (
    <div
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
