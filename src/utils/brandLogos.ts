function normalizeAppName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getBrandLogoSources(appName: string, fallbackSrc: string) {
  const normalized = normalizeAppName(appName);

  const mapping: Array<{ match: (value: string) => boolean; src: string }> = [
    { match: (value) => value === "netflix", src: "/brands/netflix.png" },
    { match: (value) => value === "spotify premium" || value === "spotify", src: "/brands/spotify.png" },
    { match: (value) => value === "youtube premium" || value === "youtube", src: "/brands/youtube.png" },
    { match: (value) => value.startsWith("icloud"), src: "/brands/icloud.png" },
    { match: (value) => value === "disney" || value === "disney plus" || value === "disney+", src: "/brands/disney.png" },
    { match: (value) => value.includes("game pass"), src: "/brands/gamepass.png" },
  ];

  const match = mapping.find((entry) => entry.match(normalized));
  const primarySrc = match?.src ?? fallbackSrc;

  return { primarySrc, fallbackSrc };
}

