import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * Authentic Storyset Pediatrician / Doctor (Medical/Family Collection)
 * Licensed by Storyset by Freepik (storyset.com)
 * Recolored with Puskesmas Primary Healthcare Palette (#0D9488)
 */
export const StorysetPediatrician: React.FC<IllustrationProps> = ({
  className = '',
  size = 140,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 flex items-center justify-center select-none ${className}`}
    >
      <img
        src="/assets/storyset/pediatrician.svg"
        alt="Dokter dan Tenaga Medis Posyandu Storyset"
        width={size}
        height={size}
        className="w-full h-full object-contain filter drop-shadow-sm pointer-events-none transition-transform hover:scale-105"
      />
    </div>
  );
};

/**
 * Authentic Storyset Healthy Nutrition Food Bowl (Food Collection)
 * Licensed by Storyset by Freepik (storyset.com)
 * Recolored with Puskesmas Nutrition Palette (#0D9488, #10B981, #F59E0B, #F43F5E)
 */
export const StorysetHealthyFood: React.FC<IllustrationProps> = ({
  className = '',
  size = 140,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 flex items-center justify-center select-none ${className}`}
    >
      <img
        src="/assets/storyset/food_bowl.svg"
        alt="Mangkuk Nutrisi Dapur Ceria Storyset"
        width={size}
        height={size}
        className="w-full h-full object-contain filter drop-shadow-md pointer-events-none transition-transform hover:scale-105"
      />
    </div>
  );
};
