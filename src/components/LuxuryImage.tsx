import { useState } from 'react';

interface LuxuryImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function LuxuryImage({ src, alt, className = '' }: LuxuryImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#16161A] via-[#1E1C18] to-[#0B0B0D] text-[#E5C77A] p-6 text-center ${className}`}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          aria-hidden="true"
          className="mb-3 opacity-80"
        >
          <rect x="9" y="2" width="6" height="3" rx="0.75" />
          <path d="M8 7h8l2 3v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10l2-3Z" />
          <path d="M10 13h4" />
        </svg>
        <span className="font-display text-base text-[#FAF9F6]/90 line-clamp-1">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
