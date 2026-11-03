import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'warm' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold tracking-tight rounded-pill transition-all duration-fast ease-spring-overshoot select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variantStyles = {
    primary:
      'bg-nutri-teal-700 text-white shadow-btn-primary hover:bg-nutri-teal-800 focus-visible:ring-nutri-teal-600',
    warm:
      'bg-nutri-orange-500 text-white shadow-btn-warm hover:bg-nutri-orange-600 focus-visible:ring-nutri-orange-500',
    secondary:
      'bg-white text-slate-900 border border-slate-200 shadow-subtle hover:bg-slate-50 focus-visible:ring-slate-400',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300',
  };

  const sizeStyles = {
    sm: 'text-xs py-2 px-4 gap-1.5 min-h-[36px]',
    md: 'text-sm py-3 px-5 gap-2 min-h-[44px]',
    lg: 'text-base py-3.5 px-6 gap-2.5 min-h-[50px]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
