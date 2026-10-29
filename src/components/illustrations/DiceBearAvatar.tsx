import React, { useState } from 'react';
import { ChildAvatarSvg } from './AvatarSvgs';

interface DiceBearAvatarProps {
  seed: string;
  gender?: 'L' | 'P';
  size?: number;
  className?: string;
}

/**
 * DiceBear Adventurer API Avatar with deterministic seeds per child name.
 * Automatically falls back to vector ChildAvatarSvg if network fails or offline.
 */
export const DiceBearAvatar: React.FC<DiceBearAvatarProps> = ({
  seed,
  gender = 'P',
  size = 48,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Adventurer style gives friendly, colorful pediatric avatars
  const diceBearUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  if (hasError) {
    return <ChildAvatarSvg gender={gender} size={size} className={className} />;
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 rounded-full overflow-hidden bg-slate-100 ${className}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse">
          <ChildAvatarSvg gender={gender} size={size} />
        </div>
      )}
      <img
        src={diceBearUrl}
        alt={`Avatar ${seed}`}
        width={size}
        height={size}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
