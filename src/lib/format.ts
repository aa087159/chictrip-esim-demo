// Small presentational helpers shared across components.

const COUNTRY_FLAG: Record<string, string> = {
  JP: "🇯🇵",
  KR: "🇰🇷",
  CN: "🇨🇳",
  HK: "🇭🇰",
  MO: "🇲🇴",
};

export const flagOf = (countryCode: string): string =>
  COUNTRY_FLAG[countryCode] ?? "🌏";
