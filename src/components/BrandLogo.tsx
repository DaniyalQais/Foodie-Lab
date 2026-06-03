import React, { useState } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function BrandLogo({
  size = 40,
  className,
  imageSrc = '/brand/fee84f38-6e38-40d0-a3eb-a1f702d87579.png',
  overlayTitle = false,
  cacheKey = 'v=2',
}: {
  size?: number;
  className?: string;
  imageSrc?: string;
  /** Only needed for older logos that require text replacement. */
  overlayTitle?: boolean;
  /** Cache-busting query string, e.g. "v=20260602". */
  cacheKey?: string;
}) {
  const s = size;
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div
      className={cx('relative shrink-0', className)}
      style={{ width: s, height: s }}
      aria-label="Foodie Lab Catering"
      role="img"
    >
      {/* Fallback initials layer (only if image missing) */}
      {hasImageError && (
        <div className="absolute inset-0 rounded-full border border-brand-200 bg-gradient-to-br from-[#111827] to-[#7c2d12] flex items-center justify-center text-white font-display font-extrabold text-[12px]">
          FL
        </div>
      )}

      {/* Base image */}
      {!hasImageError && (
        <img
          src={cacheKey ? `${imageSrc}?${cacheKey}` : imageSrc}
          alt="Foodie Lab Catering logo"
          className="absolute inset-0 w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
          loading="eager"
          onError={() => setHasImageError(true)}
        />
      )}

      {overlayTitle && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path id="foodieArcTop" d="M 18 52 A 32 32 0 0 1 82 52" />
          </defs>

          <path
            d="M 16 54 A 34 34 0 0 1 84 54 L 82 60 A 32 32 0 0 0 18 60 Z"
            fill="#f5efe3"
            opacity="0.98"
          />

          <text
            fill="#5b2b1f"
            fontSize="7.25"
            fontWeight="700"
            letterSpacing="1.1"
            style={{ textTransform: 'uppercase' }}
          >
            <textPath href="#foodieArcTop" startOffset="50%" textAnchor="middle">
              FOODIE LAB CATERING
            </textPath>
          </text>
        </svg>
      )}
    </div>
  );
}

