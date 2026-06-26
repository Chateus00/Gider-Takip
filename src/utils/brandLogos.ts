import type { SimpleIcon } from "simple-icons";
import {
  si1password,
  siAppletv,
  siApplemusic,
  siBitwarden,
  siDeezer,
  siDiscord,
  siDropbox,
  siFigma,
  siGithubcopilot,
  siHeadspace,
  siIcloud,
  siMax,
  siNetflix,
  siNordvpn,
  siNotion,
  siParamountplus,
  siPlaystation,
  siProtonmail,
  siSoundcloud,
  siSpotify,
  siSteam,
  siStrava,
  siTidal,
  siTwitch,
  siDuolingo,
  siYoutube,
  siZoom,
} from "simple-icons";

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
  fit?: "cover" | "contain";
}

export function getBrandLogoConfig(appName: string, fallbackSrc: string): BrandLogoConfig {
  const normalized = normalizeAppName(appName);

  const mapping: Array<{ match: (value: string) => boolean; config: Omit<BrandLogoConfig, "fallbackSrc"> }> = [
    {
      match: (value) => value === "netflix" || value.startsWith("netflix "),
      config: { localSrc: "/brands/netflix.png", icon: siNetflix, iconColor: "#E50914", iconBackground: "#111111" },
    },
    {
      match: (value) => value === "spotify" || value.startsWith("spotify "),
      config: { localSrc: "/brands/spotify.png", icon: siSpotify, iconColor: `#${siSpotify.hex}`, iconBackground: "#191414" },
    },
    {
      match: (value) => value === "youtube" || value.startsWith("youtube "),
      config: { localSrc: "/brands/youtube.png", icon: siYoutube, iconColor: `#${siYoutube.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value.startsWith("icloud"),
      config: { localSrc: "/brands/icloud.png", icon: siIcloud, iconColor: `#${siIcloud.hex}`, iconBackground: "#F4F7FB" },
    },
    {
      match: (value) => value === "disney" || value === "disney plus" || value === "disney+" || value.startsWith("disney "),
      config: { localSrc: "/brands/disneyplus.svg", fit: "contain" },
    },
    {
      match: (value) => value.includes("game pass"),
      config: { localSrc: "/brands/xbox-game-pass.svg", fit: "contain" },
    },
    {
      match: (value) => value === "blutv" || value.startsWith("blutv "),
      config: { localSrc: "/brands/blutv.svg", fit: "contain" },
    },
    {
      match: (value) => value === "exxen" || value.startsWith("exxen "),
      config: { localSrc: "/brands/exxen.ico", fit: "contain" },
    },
    {
      match: (value) => value === "gain" || value === "gain tv",
      config: { localSrc: "/brands/gain.ico", fit: "contain" },
    },
    {
      match: (value) => value === "bein connect" || value === "beinconnect" || value.includes("bein connect"),
      config: { localSrc: "/brands/bein-connect.ico", fit: "contain" },
    },
    {
      match: (value) => value === "apple tv" || value === "apple tv+" || value.includes("apple tv"),
      config: { icon: siAppletv, iconColor: `#${siAppletv.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "apple music" || value.startsWith("apple music") || value.includes("apple music"),
      config: { icon: siApplemusic, iconColor: `#${siApplemusic.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "dropbox" || value.startsWith("dropbox "),
      config: { icon: siDropbox, iconColor: `#${siDropbox.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "notion" || value.startsWith("notion "),
      config: { icon: siNotion, iconColor: `#${siNotion.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "zoom" || value.startsWith("zoom "),
      config: { icon: siZoom, iconColor: `#${siZoom.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "max" || value === "hbo max" || value.includes("hbo max"),
      config: { icon: siMax, iconColor: `#${siMax.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "paramount+" || value === "paramount plus" || value.includes("paramount"),
      config: { icon: siParamountplus, iconColor: `#${siParamountplus.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "steam" || value.startsWith("steam "),
      config: { icon: siSteam, iconColor: `#${siSteam.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "twitch" || value.startsWith("twitch "),
      config: { icon: siTwitch, iconColor: `#${siTwitch.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "discord" || value.startsWith("discord "),
      config: { icon: siDiscord, iconColor: `#${siDiscord.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "strava" || value.startsWith("strava "),
      config: { icon: siStrava, iconColor: `#${siStrava.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "duolingo" || value.includes("duolingo"),
      config: { icon: siDuolingo, iconColor: `#${siDuolingo.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "headspace" || value.startsWith("headspace "),
      config: { icon: siHeadspace, iconColor: `#${siHeadspace.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "proton mail" || value === "protonmail" || value.startsWith("proton"),
      config: { icon: siProtonmail, iconColor: `#${siProtonmail.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "tidal" || value.startsWith("tidal "),
      config: { icon: siTidal, iconColor: `#${siTidal.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "deezer" || value.startsWith("deezer "),
      config: { icon: siDeezer, iconColor: `#${siDeezer.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "soundcloud go" || value === "soundcloud go+" || value.startsWith("soundcloud"),
      config: { icon: siSoundcloud, iconColor: `#${siSoundcloud.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "nordvpn" || value === "nord vpn" || value.includes("nordvpn"),
      config: { icon: siNordvpn, iconColor: `#${siNordvpn.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "bitwarden" || value.startsWith("bitwarden "),
      config: { icon: siBitwarden, iconColor: `#${siBitwarden.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "1password" || value === "1 password",
      config: { icon: si1password, iconColor: `#${si1password.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "figma" || value.startsWith("figma "),
      config: { icon: siFigma, iconColor: `#${siFigma.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "github copilot" || value.includes("copilot"),
      config: { icon: siGithubcopilot, iconColor: `#${siGithubcopilot.hex}`, iconBackground: "#FFFFFF" },
    },
    {
      match: (value) => value === "playstation plus" || value === "ps plus" || value.includes("playstation plus"),
      config: { icon: siPlaystation, iconColor: `#${siPlaystation.hex}`, iconBackground: "#FFFFFF" },
    },
  ];

  const match = mapping.find((entry) => entry.match(normalized));
  return { fallbackSrc, ...(match?.config ?? {}) };
}
