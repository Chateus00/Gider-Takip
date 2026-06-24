import { useEffect, useState } from "react";
import { getBrandLogoConfig } from "@/utils/brandLogos";

interface BrandLogoImageProps {
  name: string;
  src: string;
  alt: string;
  className?: string;
}

export default function BrandLogoImage({ name, src, alt, className }: BrandLogoImageProps) {
  const { localSrc, fallbackSrc, icon, iconColor = "#111111", iconBackground = "#FFFFFF", fit } = getBrandLogoConfig(name, src);
  const [currentSrc, setCurrentSrc] = useState(localSrc ?? fallbackSrc);
  const [showVector, setShowVector] = useState(Boolean(icon && !localSrc));

  useEffect(() => {
    setCurrentSrc(localSrc ?? fallbackSrc);
    setShowVector(Boolean(icon && !localSrc));
  }, [fallbackSrc, icon, localSrc]);

  if (showVector && icon) {
    return (
      <span
        className={`inline-flex items-center justify-center overflow-hidden ${className ?? ""}`}
        aria-label={alt}
        role="img"
        style={{ backgroundColor: iconBackground }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
          <path d={icon.path} fill={iconColor} />
        </svg>
      </span>
    );
  }

  const imageClassName = fit === "contain" ? `${className ?? ""} object-contain p-3` : className;

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={imageClassName}
      onError={() => {
        if (icon) {
          setShowVector(true);
          return;
        }

        if (fallbackSrc !== currentSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
