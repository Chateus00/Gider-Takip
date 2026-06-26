import { useEffect, useState } from "react";
import { getBrandLogoConfig } from "@/utils/brandLogos";

interface BrandLogoImageProps {
  name: string;
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function BrandLogoImage({ name, src, alt, className, containerClassName }: BrandLogoImageProps) {
  const { localSrc, fallbackSrc, icon, iconColor = "#111111", fit } = getBrandLogoConfig(name, src);
  const [currentSrc, setCurrentSrc] = useState(localSrc ?? fallbackSrc);
  const [showVector, setShowVector] = useState(Boolean(icon && !localSrc));

  useEffect(() => {
    setCurrentSrc(localSrc ?? fallbackSrc);
    setShowVector(Boolean(icon && !localSrc));
  }, [fallbackSrc, icon, localSrc]);

  const mediaClassName = fit === "contain" ? `${className ?? ""} object-contain` : className;

  return (
    <span className={containerClassName}>
      {showVector && icon ? (
        <svg viewBox="0 0 24 24" aria-label={alt} role="img" className={mediaClassName}>
          <path d={icon.path} fill={iconColor} />
        </svg>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          className={mediaClassName}
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
      )}
    </span>
  );
}
