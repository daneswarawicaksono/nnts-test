import React from 'react';

export interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'blue' | 'white' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  children,
  variant = 'green',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  className = '',
  ...props
}) => {
  // 3D Push Button with intentional bottom shadow bevel
  // Translates down 2-3px on active, reducing the bottom bevel
  const baseStyles =
    'relative inline-flex items-center justify-center font-extrabold tracking-wide uppercase font-child select-none transition-all duration-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-[3px] disabled:pointer-events-none rounded-2xl cursor-pointer';

  const variantStyles = {
    // Brand Primary Green (#58CC02 with #46A302 4px lower bevel)
    green:
      'bg-[#58CC02] text-white border-b-4 border-[#46A302] active:border-b-[2px] shadow-sm hover:brightness-105 focus-visible:ring-[#58CC02]',
    // Secondary Accent Sky Blue (#1CB0F6 with #1899D6 4px lower bevel)
    blue:
      'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] active:border-b-[2px] shadow-sm hover:brightness-105 focus-visible:ring-[#1CB0F6]',
    // White Card Surface with 2px border and 4px lower bevel
    white:
      'bg-white text-[#4B4B4B] border-2 border-[#E5E5E5] border-b-4 border-b-[#CECECE] active:border-b-2 hover:bg-slate-50 focus-visible:ring-slate-300',
    // Streak Gold (#FF9600 with #D97706 bevel)
    gold:
      'bg-[#FF9600] text-white border-b-4 border-[#D97706] active:border-b-[2px] shadow-sm hover:brightness-105 focus-visible:ring-[#FF9600]',
    // Danger Red
    danger:
      'bg-[#EF4444] text-white border-b-4 border-[#DC2626] active:border-b-[2px] shadow-sm hover:brightness-105 focus-visible:ring-[#EF4444]',
  };

  const disabledStyles =
    'bg-[#E5E5E5] text-[#AFAFAF] border-b-4 border-[#CECECE] shadow-none cursor-not-allowed active:translate-y-0 active:border-b-4';

  const sizeStyles = {
    sm: 'text-xs py-2 px-3 gap-1.5 min-h-[44px] min-w-[44px]',
    md: 'text-sm py-3 px-5 gap-2 min-h-[48px]',
    lg: 'text-base py-3.5 px-6 gap-2.5 min-h-[52px]',
  };

  return (
    <button
      disabled={disabled}
      className={`
        ${baseStyles}
        ${disabled ? disabledStyles : variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
