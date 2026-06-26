function normalizeAppName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const managementLinks: Array<{ match: (value: string) => boolean; url: string }> = [
  {
    match: (value) => value === "netflix" || value.startsWith("netflix "),
    url: "https://www.netflix.com/YourAccount",
  },
  {
    match: (value) => value === "spotify" || value.startsWith("spotify "),
    url: "https://www.spotify.com/account/subscription/",
  },
  {
    match: (value) => value === "youtube" || value.startsWith("youtube "),
    url: "https://www.youtube.com/paid_memberships",
  },
  {
    match: (value) => value.startsWith("icloud"),
    url: "https://apps.apple.com/account/subscriptions",
  },
  {
    match: (value) => value === "disney" || value === "disney plus" || value === "disney+" || value.startsWith("disney "),
    url: "https://www.disneyplus.com/account",
  },
  {
    match: (value) => value.includes("game pass"),
    url: "https://account.microsoft.com/services",
  },
  {
    match: (value) => value === "apple tv" || value === "apple tv+" || value.includes("apple tv"),
    url: "https://apps.apple.com/account/subscriptions",
  },
  {
    match: (value) => value === "apple music" || value.startsWith("apple music") || value.includes("apple music"),
    url: "https://apps.apple.com/account/subscriptions",
  },
  {
    match: (value) => value === "dropbox" || value.startsWith("dropbox "),
    url: "https://www.dropbox.com/account/plan",
  },
  {
    match: (value) => value === "notion" || value.startsWith("notion "),
    url: "https://www.notion.so/settings/plans",
  },
  {
    match: (value) => value === "zoom" || value.startsWith("zoom "),
    url: "https://zoom.us/billing",
  },
  {
    match: (value) => value === "figma" || value.startsWith("figma "),
    url: "https://www.figma.com/settings/billing",
  },
  {
    match: (value) => value === "github copilot" || value.includes("copilot"),
    url: "https://github.com/settings/copilot",
  },
  {
    match: (value) => value === "proton mail" || value === "protonmail" || value.startsWith("proton"),
    url: "https://account.proton.me/mail",
  },
  {
    match: (value) => value === "nordvpn" || value === "nord vpn" || value.includes("nordvpn"),
    url: "https://my.nordaccount.com/dashboard/nordvpn/",
  },
  {
    match: (value) => value === "bitwarden" || value.startsWith("bitwarden "),
    url: "https://vault.bitwarden.com/#/settings/subscription",
  },
];

export function getSubscriptionManagementUrl(appName: string) {
  const normalized = normalizeAppName(appName);
  return managementLinks.find((entry) => entry.match(normalized))?.url ?? null;
}
