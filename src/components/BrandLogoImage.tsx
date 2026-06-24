import { useEffect, useState } from "react";
import { getBrandLogoSources } from "@/utils/brandLogos";

interface BrandLogoImageProps {
  name: string;
  src: string;
  alt: string;
  className?: string;
}

export default function BrandLogoImage({ name, src, alt, className }: BrandLogoImageProps) {
  const { primarySrc, fallbackSrc } = getBrandLogoSources(name, src);
  const [currentSrc, setCurrentSrc] = useState(primarySrc);

  useEffect(() => {
    setCurrentSrc(primarySrc);
  }, [primarySrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc !== currentSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

