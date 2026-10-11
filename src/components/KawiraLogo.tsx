import React from 'react';

interface KawiraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'color' | 'white';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const KawiraLogo: React.FC<KawiraLogoProps> = ({
  size = 'md',
  variant = 'color',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-13 h-13 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const tagSizes = {
    sm: 'text-[9px] -mt-1',
    md: 'text-[11px] -mt-1',
    lg: 'text-[13px] -mt-1',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
      aria-label="Kawira (Kawan Berwirausaha)"
    >
      {/* Official Vector K-Icon Mark */}
      <div
        className={`${iconSizes[size]} bg-[#6C4CF5] shadow-md shadow-[#6C4CF5]/20 flex items-center justify-center p-1.5 flex-shrink-0 relative overflow-hidden`}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Vertical white pillar */}
          <rect x="18" y="16" width="13" height="68" rx="6.5" fill="#FFFFFF" />
          
          {/* Upper lime branch with yellow round head */}
          <g>
            <path
              d="M26 50 L70 24"
              stroke="#C6F135"
              strokeWidth="13"
              strokeLinecap="round"
            />
            {/* Round yellow dot at tip */}
            <circle cx="70" cy="24" r="7.5" fill="#FFF199" />
          </g>
          
          {/* Lower hot pink branch */}
          <path
            d="M26 52 L68 76"
            stroke="#FF3E80"
            strokeWidth="13"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col leading-tight justify-center">
        <span
          className={`font-extrabold tracking-tight ${textSizes[size]} ${
            variant === 'white' ? 'text-white' : 'text-[#6C4CF5]'
          }`}
          style={{ letterSpacing: '-0.03em' }}
        >
          Kawira
        </span>
        {showTagline && (
          <span
            className={`font-semibold tracking-wide ${tagSizes[size]} ${
              variant === 'white' ? 'text-[#C6F135]' : 'text-[#FF3E80]'
            }`}
          >
            kawan berwirausaha
          </span>
        )}
      </div>
    </div>
  );
};
