import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const variantStyles = {
    text: 'h-4 rounded-sm w-full',
    circular: 'rounded-full shrink-0',
    rectangular: 'rounded-md w-full',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      style={style}
      className={`bg-slate-200/70 animate-pulse ${variantStyles[variant]} ${className}`}
      aria-hidden="true"
    />
  );
};
