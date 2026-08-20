import React from 'react';

export const LogoIcon = ({ className = "w-8 h-8", color = "currentColor" }) => (
  <svg
    viewBox="0 0 120 70"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Roof curve */}
      <path d="M 28 28 C 42 12, 72 12, 88 28" />
      {/* Front hood & front wheel arch */}
      <path d="M 88 28 L 102 33 C 106 34, 108 37, 108 42 L 108 50 L 98 50 C 98 40, 82 40, 82 50 L 66 50" />
      {/* Rear trunk & rear wheel arch */}
      <path d="M 28 28 L 16 31 C 12 32, 10 35, 10 40 L 10 50 L 20 50 C 20 40, 36 40, 36 50" />
      {/* Infinity ribbon flow swooping up into arrow */}
      <path d="M 36 50 C 50 50, 64 36, 78 28 C 90 20, 104 20, 110 18" />
      {/* Arrowhead */}
      <path d="M 103 11 L 115 18 L 103 25 Z" fill={color} stroke="none" />
    </g>
  </svg>
);

export const Logo = ({
  variant = 'full', // 'full' | 'horizontal' | 'icon'
  size = 'md',      // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  showTagline = true,
  invert = false,
}) => {
  const textColor = invert ? 'text-black' : 'text-white';
  const iconColor = invert ? '#000000' : '#FFFFFF';
  const taglineColor = invert ? 'text-zinc-600' : 'text-zinc-400';

  if (variant === 'icon') {
    const iconSizes = {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };
    return <LogoIcon className={`${iconSizes[size]} ${className}`} color={iconColor} />;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center p-1.5 shadow-md shrink-0">
          <LogoIcon className="w-full h-full" color="#000000" />
        </div>
        <div className="flex flex-col">
          <span className={`text-lg font-black tracking-tight ${textColor} leading-none`}>
            Shafi<span className={invert ? "text-zinc-600" : "text-zinc-400"}>Go</span>
          </span>
          {showTagline && (
            <span className={`text-[8px] font-extrabold tracking-[0.2em] uppercase ${taglineColor} mt-0.5 leading-none`}>
              RIDE. ARRIVE. GO.
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full stacked logo
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center p-2.5 shadow-xl mb-3">
        <LogoIcon className="w-full h-full" color="#000000" />
      </div>
      <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${textColor} leading-none`}>
        Shafi<span className={invert ? "text-zinc-600" : "text-zinc-400"}>Go</span>
      </h2>
      {showTagline && (
        <span className={`text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase ${taglineColor} mt-1.5`}>
          RIDE. ARRIVE. GO.
        </span>
      )}
    </div>
  );
};

export default Logo;
