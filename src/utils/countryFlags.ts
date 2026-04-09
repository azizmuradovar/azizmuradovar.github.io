const FLAGS: Record<string, string> = {
  Thailand: "🇹🇭",
  Brazil: "🇧🇷",
  Colombia: "🇨🇴",
  Guatemala: "🇬🇹",
  Ethiopia: "🇪🇹",
  Honduras: "🇭🇳",
  "Papua New Guinea": "🇵🇬",
  "Costa Rica": "🇨🇷",
  Peru: "🇵🇪",
  Panama: "🇵🇦",
};

export const getCountryFlag = (country: string): string =>
  FLAGS[country] ?? "🏳️";
