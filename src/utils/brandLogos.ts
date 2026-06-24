import type { SimpleIcon } from "simple-icons";
import { siIcloud, siNetflix, siSpotify, siYoutube } from "simple-icons";

function normalizeAppName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface BrandLogoConfig {
  localSrc?: string;
  fallbackSrc: string;
  icon?: SimpleIcon;
  iconColor?: string;
  iconBackground?: string;
}

export function getBrandLogoConfig(appName: string, fallbackSrc: string): BrandLogoConfig {
  const normalized = normalizeAppName(appName);

  const mapping: Array<{ match: (value: string) => boolean; config: Omit<BrandLogoConfig, "fallbackSrc"> }> = [
    {
      match: (value) => value === "netflix",
      config: { localSrc: "/brands/netflix.png", icon: siNetflix, iconColor: "#E50914", iconBackground: "#111111" },
    },
    {
      match: (value) => value === "spotify premium" || value === "spotify",
      config: { localSrc: "/brands/spotify.png", icon: siSpotify, iconColor: `#${siSpotify.hex}`, iconBackground: "#191414" },
    },
    {
      match: (value) => value === "youtube premium" || value === "youtube",
      config: { localSrc: "/brands/youtube.png", icon: siYoutube, iconColor: `#${siYoutube.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value.startsWith("icloud"),
      config: { localSrc: "/brands/icloud.png", icon: siIcloud, iconColor: `#${siIcloud.hex}`, iconBackground: "#F4F7FB" },
    },
    {
      match: (value) => value === "disney" || value === "disney plus" || value === "disney+",
      config: { localSrc: "/brands/disney.png" },
    },
    {
      match: (value) => value.includes("game pass"),
      config: { localSrc: "/brands/gamepass.png" },
    },
  ];

  const match = mapping.find((entry) => entry.match(normalized));
  return { fallbackSrc, ...(match?.config ?? {}) };
}
